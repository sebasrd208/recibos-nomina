export enum Rol {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export interface Usuarios {
    idUsuario?: number;
    usuario: string;
    password: string;
    rol: Rol;
}