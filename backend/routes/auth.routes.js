import express from 'express'
import { login, signUp,logout } from '../controllers/auth.controller.js'

export let authRouter=express.Router()

authRouter.post("/signup",signUp)
authRouter.post("/login",login)
authRouter.get("/logout",logout)


