import User from '../../models/user';

export default class UserAdapter {
    static fromFirebaseResponse(data: any): User {
        return new User({
            userId: data.userId,
            displayName: data.displayName,
            picture: data.photoURL,
            email: data.email
        });
    }
}
