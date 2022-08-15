import { createReducer, on } from '@ngrx/store';
import { Usuario } from 'src/app/models/usuario.model';
import { setUser, onSetUser } from './auth.actions';

export interface State {
    user: Usuario | null;
}

export const initialState: State = {
    user: null,
}

const _authReducer = createReducer(initialState,
    // user: recibo el usuario que se crea por props 
    on(setUser, (state, { user }) => ({
        ...state,
        user: { ...user }
    })),
    on(onSetUser, (state) => ({
        ...state,
        user: null
    }))

);

export function authReducer(state: any, action: any) {
    return _authReducer(state, action);
}