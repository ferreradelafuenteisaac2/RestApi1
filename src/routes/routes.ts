import {Request, Response, Router } from 'express'
import { Autos, iAuto } from '../model/autos'
import { db } from '../database/database'

class DatoRoutes {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }

    private getAutos = async (req: Request, res: Response) => {
        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query = await Autos.find({})
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })

        db.desconectarBD()
    }

    private getAutos2 = async (req: Request, res: Response) => {
        const { matricula } = req.params
        console.log(req.params)
        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query = await Autos.aggregate([
                {
                    $match: {_matricula:matricula}
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })

        db.desconectarBD()
    }

    private postautos = async (req: Request, res: Response) => {
        const { tipoObjeto, precioBase, potenciaMotor, traccion, matricula } = req.body
        console.log(req.body)
        let oSchema: any
        const dschemaP: iAuto =
            {
                _tipoObjeto: tipoObjeto,
                _precioBase: precioBase,
                _potenciaMotor: potenciaMotor,
                _traccion: traccion,
                _matricula: matricula
            }
        oSchema = new Autos(dschemaP)
        await db.conectarBD()
        await oSchema.save()
        .then( async (mensaje: any) => {
            console.log(mensaje)
            res.json(oSchema)
        })
        .catch((mensaje: any) => {
            res.send(mensaje)
        })

        db.desconectarBD()
    }

    private putAutos = async (req: Request, res: Response) => {
        const { matricula, potenciaMotor } = req.params
        console.log(req.params)
        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query = await Autos.findOneAndUpdate(
                {_matricula:matricula}, {_potenciaMotor:potenciaMotor}
            )
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })

        db.desconectarBD()
    }

    private deleteAuto = async (req: Request, res: Response) => {
        const { matricula } = req.params
        console.log(req.params)
        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query = await Autos.findOneAndDelete(
                {_matricula:matricula}
            )
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })

        db.desconectarBD()
    }

    misRutas(){
        this._router.get('/autos', this.getAutos)
        this._router.get('/autos/:matricula', this.getAutos2)
        this._router.post('/autos/n', this.postautos)
        this._router.put('/autos/m/:matricula/:potenciaMotor', this.putAutos)
        this._router.delete('/autos/borrar/:matricula', this.deleteAuto)
    }
}

const obj = new DatoRoutes()
obj.misRutas()
export const routes = obj.router
