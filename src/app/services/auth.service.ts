import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;

  constructor(public auth: AngularFireAuth,
    public fireStore: AngularFirestore,
    private store: Store<AppState>) { }

  initAuthListener() {
    this.auth.authState.subscribe(fuser => {
      if (fuser) {
        this.userSubscription = this.fireStore.doc(`${fuser.uid}/usuario`).valueChanges()
          .subscribe((fireStoreUser: any) => {
            const user = Usuario.fromFirebase(fireStoreUser);
            this.store.dispatch(authActions.setUser({ user }));
          });
      } else {
        this.userSubscription?.unsubscribe();
        this.store.dispatch(authActions.onSetUser());
      }


    });
  }

  crearUsuario(nombre: string, email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const newUser = new Usuario(user?.uid, nombre, email);
        return this.fireStore.doc(`${user?.uid}/usuario`).set({ ...newUser });
      })
  }

  loginUsuario(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(
      map(fbUser => fbUser != null)
    );
  }
}
