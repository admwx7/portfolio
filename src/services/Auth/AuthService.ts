import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase, ref, onValue, off, DatabaseReference } from 'firebase/database';
import { ObserverType, fireObservers, observe } from '../../utils/observer';
import { parseJwt } from '../../utils/parser';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// App initialization
const app = initializeApp({
  apiKey: 'AIzaSyCjMz2srT0HjuJRPH2ThhLD7XqLcrYqSQQ',
  authDomain: 'portfolio-138c8.firebaseapp.com',
  databaseURL: 'https://portfolio-138c8.firebaseio.com',
  projectId: 'portfolio-138c8',
  storageBucket: 'portfolio-138c8.appspot.com',
  messagingSenderId: '807153287758',
  appId: '1:807153287758:web:a4b9fca89e60a6d2b7b91f',
});
getAnalytics(app);

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

/**
 * UI Service used for authenticating users and interfacing with the User object for roles.
 */
export class AuthService {
  private auth = getAuth();
  private database = getDatabase();
  private dbQuery?: DatabaseReference;
  private provider = new GoogleAuthProvider();
  private _roles?: Role[];
  private get roles(): Role[] | undefined {
    return this._roles;
  }
  private set roles(value: Role[]) {
    this._roles = value;
    fireObservers(ObserverType.UserRoles, value);
  }

  get currentUser(): { getIdToken: (forceRefresh: boolean) => Promise<string> } | null {
    return this.auth.currentUser || null;
  }

  constructor() {
    this.fetchUserRoles = this.fetchUserRoles.bind(this);

    this.onAuthStateChanged((user: { uid: string } | null) => {
      // Close previous DB connection
      if (this.dbQuery) {
        off(this.dbQuery, 'value', () => { delete this.dbQuery; });
      }

      if (!user) this.fetchUserRoles(); // Update roles for no user
      else { // Establish a new DB connection, will update roles for the current user
        this.dbQuery = ref(this.database, `metadata/${user.uid}/refreshTime`);
        onValue(this.dbQuery, () => this.fetchUserRoles({ forceRefresh: true }));
      }
    });
  }

  /**
   * Fetches updated roles for a given user from the API so it can be easily consumed in the UI later.
   *
   * @param root0
   * @param root0.forceRefresh
   */
  private async fetchUserRoles({ forceRefresh } = { forceRefresh: false }): Promise<void> {
    let userRoles: Role[] = [];
    try {
      if (!this.currentUser) return;
      const { roles } =
        parseJwt(await this.currentUser.getIdToken(forceRefresh)) as unknown as { roles: Record<Role, boolean> };
      userRoles = (Object.keys(roles) as Role[]).
        filter((role: Role) => Boolean(roles[role]));
    } catch (e) { /* */ }
    this.roles = userRoles;
  }

  /**
   * Provides a hook for watching auth state changes.
   */
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
      await signInWithPopup(this.auth, this.provider);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch ({ code, credential, email, message }: any) {
      console.error('Auth Error', code, credential, email, message);
    }
  }
  /**
   * Signs a user out.
   */
  async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch ({ code, credential, email, message }: any) {
      console.error('Auth Error', code, credential, email, message);
    }
  }
}
