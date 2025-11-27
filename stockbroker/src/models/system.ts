import { NotificationService } from "../services/notificationService";
import { User } from "./user";

/**
 * Static System class acting as a simple in‑memory registry for {@link User} instances.
 * All methods and the internal storage are static, allowing you to access the
 * functionality anywhere without needing to instantiate the class.
 */
export class System {
    /**
     * Holds all registered users keyed by their unique identifier.
     */
    private static users: Map<string, User> = new Map();

    /**
     * Optional initializer to pre‑populate the registry.
     * Call this once at application start‑up if you have an initial list of users.
     */
    static init(users: User[] = []): void {
        users.forEach(user => System.addUser(user));
    }

    /**
     * Register a new user in the system.
     */
    static addUser(user: User): void {
        System.users.set(user.getId(), user);
        NotificationService.emitNewUserEvent(user.getId())
    }

    /**
     * Retrieve a user by its identifier.
     */
    static getUser(id: string): User | undefined {
        return System.users.get(id);
    }

    /**
     * Get the full map of users. Returns a reference; callers should treat it as read‑only.
     */
    static getUsers(): Map<string, User> {
        return System.users;
    }
}