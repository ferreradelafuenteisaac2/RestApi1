"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const autos_1 = require("../model/autos");
const database_1 = require("../database/database");
class DatoRoutes {
    constructor() {
        this.getAutos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then((mensaje) => __awaiter(this, void 0, void 0, function* () {
                console.log(mensaje);
                const query = yield autos_1.Autos.find({});
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            database_1.db.desconectarBD();
        });
        this.getAutos2 = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { matricula } = req.params;
            console.log(req.params);
            yield database_1.db.conectarBD()
                .then((mensaje) => __awaiter(this, void 0, void 0, function* () {
                console.log(mensaje);
                const query = yield autos_1.Autos.aggregate([
                    {
                        $match: { _matricula: matricula }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            database_1.db.desconectarBD();
        });
        this.postautos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { tipoObjeto, precioBase, potenciaMotor, traccion, matricula } = req.body;
            console.log(req.body);
            let oSchema;
            const dschemaP = {
                _tipoObjeto: tipoObjeto,
                _precioBase: precioBase,
                _potenciaMotor: potenciaMotor,
                _traccion: traccion,
                _matricula: matricula
            };
            oSchema = new autos_1.Autos(dschemaP);
            yield database_1.db.conectarBD();
            yield oSchema.save()
                .then((mensaje) => __awaiter(this, void 0, void 0, function* () {
                console.log(mensaje);
                res.json(oSchema);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            database_1.db.desconectarBD();
        });
        this.putAutos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { matricula, potenciaMotor } = req.params;
            console.log(req.params);
            yield database_1.db.conectarBD()
                .then((mensaje) => __awaiter(this, void 0, void 0, function* () {
                console.log(mensaje);
                const query = yield autos_1.Autos.findOneAndUpdate({ _matricula: matricula }, { _potenciaMotor: potenciaMotor });
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            database_1.db.desconectarBD();
        });
        this.deleteAuto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { matricula } = req.params;
            console.log(req.params);
            yield database_1.db.conectarBD()
                .then((mensaje) => __awaiter(this, void 0, void 0, function* () {
                console.log(mensaje);
                const query = yield autos_1.Autos.findOneAndDelete({ _matricula: matricula });
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            database_1.db.desconectarBD();
        });
        this._router = (0, express_1.Router)();
    }
    get router() {
        return this._router;
    }
    misRutas() {
        this._router.get('/autos', this.getAutos);
        this._router.get('/autos/:matricula', this.getAutos2);
        this._router.post('/autos/n', this.postautos);
        this._router.put('/autos/m/:matricula/:potenciaMotor', this.putAutos);
        this._router.delete('/autos/borrar/:matricula', this.deleteAuto);
    }
}
const obj = new DatoRoutes();
obj.misRutas();
exports.routes = obj.router;
