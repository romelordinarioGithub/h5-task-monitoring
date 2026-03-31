import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type UserCredential,
} from 'firebase/auth'
import { firebaseAuth } from '@/shared/lib/firebase'

const provider = new GoogleAuthProvider()

export async function signInWithGoogle(): Promise<UserCredential> {
  return signInWithPopup(firebaseAuth, provider)
}

export async function logout(): Promise<void> {
  await signOut(firebaseAuth)
}
