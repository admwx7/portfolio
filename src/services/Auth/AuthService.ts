import '@firebase/auth';
import '@firebase/database';
import {Reference} from '@firebase/database';
import FirebaseService from '../Firebase';
import {ObserverType, fireObservers, observe} from '../../utils/observer';
import {parseJwt} from '../../utils/parser';

/**
 * Possible roles a user can have.
 */
export enum Role {
  Admin = 'admin',
  Alpha = 'alpha',
  Author = 'author',
  Beta = 'beta',
  User = 'user',
}

export class AuthService {
  private auth = FirebaseService.auth();
  private database = FirebaseService.database();
  private dbRef: Reference = null;
  private provider = new FirebaseService.auth.GoogleAuthProvider();
  private _roles: Role[];
  private get roles(): Role[] {
    return this._roles;
  }
  private set roles(value: Role[]) {
    this._roles = value;
    fireObservers(ObserverType.UserRoles, value);
  }

  get currentUser(): { getIdToken: (forceRefresh: boolean) => Promise<string> } {
    return this.auth.currentUser;
  }

  constructor() {
    this.fetchUserRoles = this.fetchUserRoles.bind(this);

    this.onAuthStateChanged((user: { uid: string } | null) => {
      // Close previous DB connection
      if (this.dbRef) {
        this.dbRef.off();
        this.dbRef = null;
      }

      if (!user) this.fetchUserRoles(); // Update roles for no user
      else { // Establish a new DB connection, will update roles for the current user
        this.dbRef = this.database.ref(`metadata/${user.uid}/refreshTime`) as Reference;
        this.dbRef.on('value', () => this.fetchUserRoles({forceRefresh: true}));
      }
    });
  }

  /**
   * Fetches updated roles for a given user from the API so it can be easily consumed in the UI later.
   *
   * @param root0
   * @param root0.forceRefresh
   */
  private async fetchUserRoles({forceRefresh} = {forceRefresh: false}): Promise<void> {
    let userRoles: Role[] = [];
    try {
      const {roles} =
        parseJwt(await this.currentUser.getIdToken(forceRefresh)) as unknown as { roles: Record<Role, boolean> };
      userRoles = (Object.keys(roles) as Role[]).
        filter((role: Role) => Boolean(roles[role]));
    } catch (e) {/* */}
    this.roles = userRoles;
  }

  /**
   * Provides a hook for watching auth state changes.
   */
  // eslint-disable-next-line no-invalid-this
  onAuthStateChanged = this.auth.onAuthStateChanged.bind(this.auth);
  /**
   * Uses the observer util to notify of changes to the roles associated with the current user.
   *
   * @param callback - The logic to run when the roles are updated.
   * @returns - Deregistration function for cleanup.
   */
  onUserRolesChanged(callback: (roles: Role[]) => void): () => void {
    if (this.roles) callback(this.roles);

    return observe(ObserverType.UserRoles, callback);
  }
  /**
   * Starts the sign in process for a user via Google.
   */
  async signIn(): Promise<void> {
    try {
      await this.auth.signInWithPopup(this.provider);
    } catch ({code, credential, email, message}) {
      console.error('Auth Error', code, credential, email, message);
    }
  }
  /**
   * Signs a user out.
   */
  async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
    } catch ({code, credential, email, message}) {
      console.error('Auth Error', code, credential, email, message);
    }
  }
}
