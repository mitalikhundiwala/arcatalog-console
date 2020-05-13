export default class User {
    userId: string;
    displayName: string;
    picture: string;
    email: string;

    constructor(data) {
        this.userId = data.userId;
        this.displayName = data.displayName;
        this.picture = data.picture;
        this.email = data.email;
    }
}
