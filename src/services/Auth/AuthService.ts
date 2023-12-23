import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { ObserverType, fireObservers, observe } from '../../utils/observer';
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
  Beta = 'beta',
  User = 'user',
  Banking = 'banking',
}

/**
 * UI Service used for authenticating users and interfacing with the User object for roles.
 */
export class AuthService {
  private auth = getAuth();
  private database = getFirestore();
  private subscription?: Unsubscribe;
  private provider = new GoogleAuthProvider();
  private _roles?: Role[];
  private get roles(): Role[] | undefined {
    return this._roles;
  }
  private set roles(value: Role[]) {
    this._roles = value;
    fireObservers(ObserverType.UserRoles, value);
  }

  get currentUser(): User | null {
    return this.auth.currentUser || null;
  }

  constructor() {
    this.onAuthStateChanged((user: { uid: string } | null) => {
      // Close previous DB connection
      this.subscription?.();
      this.subscription = undefined;

      if (!user) {
        // Update roles for no user
        this.roles = [];
      } else { // Establish a new DB connection, will update roles for the current user
        this.subscription = onSnapshot(
          doc(this.database, 'users', user.uid),
          (doc) => {
            const data = doc.data() as { roles: Record<Role, boolean> };
            if (!data) return;
            const { roles } = data;
            this.roles = (Object.keys(roles) as Role[]).filter((role: Role) => Boolean(roles[role]));
          }
        );
      }
    });
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
