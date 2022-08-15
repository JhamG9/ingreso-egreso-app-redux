export class Usuario {

    static fromFirebase({ uid = '', nombre = '', email = '' }) {
        return new Usuario(uid, nombre, email);
    }

    constructor(public uid: String = '',
        public nombre: String,
        public email: String) {

    }
}