import React, { Component } from 'react'
import Footer from '../Footer'
import {
    Button,
    Card,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Modal
} from "reactstrap";
export default class users extends Component {
    constructor() {
        super()
        this.state = {
            Tusuarios: [],
            defaultModal: false,
            datoserror: {},
            usuario: {},
            mensaje: '',
            borrar: ''
        }
    }

    componentDidMount() {
        this.listar()
    }
    eliminarusuario(id) {
        if (window.confirm('¿Estas seguro de eliminar esta Cliente?')) {
            const envio = {
                method: 'DELETE',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Origin': 'http://localhost:4000/',
                    'Accept': 'application/json'
                }),
            };
            fetch(`http://localhost:4000/Cliente/_id/${id}`, envio)
                .then(alert('Cliente eliminado'), this.listar())
                .catch(e => console.log(e))
        }
    }
    ActualizarUsuario = (id) => {
        const envio = {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:4000/',
                'Accept': 'application/json'
            }),
        };
        fetch(`http://localhost:4000/Cliente/_id/${id}`, envio)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error('Cliente no existe')
            })
            .then(token => {
                this.setState({ usuario: token.users[0] })
                this.toggleModal('formModal2')
                return;
            })
            .catch(e => {
                this.setState({ mensaje: e.message })
            })
    }

    listar = (e) => {
        const token12 = localStorage.getItem('token')
        const envio = {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:4000/',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token12}`,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
                'Allow': 'GET, POST, OPTIONS, PUT, DELETE'
            }),
        };
        console.log()
        fetch('http://localhost:4000/cliente/', envio)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error('Cñiente no creado')
            })
            .then(token => {
                if (token.message === 'NO CONTENT') {

                }
                else {
                    this.setState({ Tusuarios: token.users })
                }

                return;
            })
            .catch(e => {
                this.setState({ mensaje: e.message })
            })
    }

    toggleModal = state => {
        this.setState({
            [state]: !this.state[state]
        });
    };


    consultas = (e) => {
        e.preventDefault();
        let opcion;

        switch (this.opcionbusqueda) {
            case 'Nombre':
                opcion = 'name'
                break;
            case 'Nombre de usuario':
                opcion = 'username'
                break;
            case 'Correo':
                opcion = 'email'
                break;
            default:
                opcion = ''
                break;
        }
        const envio = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:4000/',
                'Accept': 'application/json',
                "Access-Control-Allow-Origin": '*',
                'Access-Control-Allow-Headers': 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
                'Allow': 'GET, POST, OPTIONS, PUT, DELETE'
            }
        };
        fetch(`http://localhost:4000/Cliente/${opcion}/${this.cajatexto}`, envio)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error('Cliente no encontrado')
            })
            .then(token => {
                this.setState({ Tusuarios: token.users })
                return;
            })
            .catch(e => {
                this.setState({ mensaje: e.message })
            })
    }
    mostartodo = (e) => {
        e.preventDefault();
        this.listar();
    }


    UserNew = (e) => {
        e.preventDefault();
        const datos = {
            name: this.name,
            username: this.username,
            email: this.correo,
            password: this.username
        }
        const envio = {
            method: 'POST',
            body: JSON.stringify(datos),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:4000/',
                'Accept': 'application/json'
            }),
        };
        fetch('http://localhost:4000/cliente/register', envio)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                this.setState({ mensaje: "Cliente no creado" })
                this.setState({ datoserror: { icon: 'times', color: 'danger' } })
                this.toggleModal('notificationModal')
                throw new Error('mascota no creada')
            })
            .then(token => {
                this.setState({ mensaje: "Cliente creado" })
                this.listar()
                this.setState({ datoserror: { icon: 'check', color: 'success' } })
                this.toggleModal('notificationModal')
                return;
            })
            .catch(e => {
                this.setState({ mensaje: e.message })
            })
    }
    actualizar2 = (e) => {
        const id_d = this.state.usuario._id;
        e.preventDefault();
        if (this.name === undefined) {
            this.setState({ mensaje: "Añade un nombre por favor" })
            this.setState({ datoserror: { icon: 'bell', color: 'warning' } })
            this.toggleModal('notificationModal')
        } else {
            const datos = {
                name: this.name,
                telefono: this.telefono,
                correo: this.correo,
                password: this.password
            }
            const envio = {
                method: 'PUT',
                body: JSON.stringify(datos),
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Origin': 'http://localhost:4000/',
                    'Accept': 'application/json'
                }),
            };
            console.log(envio)
            fetch(`http://localhost:4000/Clienete/_id/${id_d}`, envio)
                .then(response => {
                    if (response.ok) {
                        return response.json()
                    }
                    this.setState({ mensaje: "Cliente no actualizado" })
                    this.setState({ datoserror: { icon: 'times', color: 'danger' } })
                    this.toggleModal('notificationModal')
                    throw new Error('Cliente no creado')
                })
                .then(token => {
                    this.setState({ mensaje: "Cliente actualizado" })
                    this.listar()
                    this.setState({ datoserror: { icon: 'check', color: 'success' } })
                    this.toggleModal('notificationModal')
                    return;
                })
                .catch(e => {
                    console.log(e)
                })
        }
    }
    render() {
        return (
            <div>
                <div class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center" style={{ minHeight: '600px', backgroundImage: 'url(https://www.ittrends.es/files/201707/tipos-clientes-banca.jpg)', backgroundSize: 'cover', backgroundPosition: 'center top' }}>
                    <span class="mask bg-gradient-default opacity-8"></span>
                    <div class="container-fluid d-flex align-items-center">
                        <div class="row">
                            <div class="col-lg-8 col-md-10">
                                <h5 class="display-3 text-white">Estas En la seccion de Clientes</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container-fluid mt--9">
                    <div class="row">
                        <div class="col-xl-4 order-xl-2 mb-0 mb-xl-0">
                            <div class="card card-profile shadow">
                                <div class="card-body mt-4 pt-md-4">
                                    <div class="text-center">
                                    <h3>
                                            ¡¡TEN CUIDADO!!
                                        </h3>
                                        <div>
                                            <i class="ni education_hat mr-2"></i>En este modulo podras crear, actualizar, editar o eliminar clientes. Asi como ver los clientes ya creados o buscar uno en especifico.
                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-12 order-xl-2">
                            <div class="card bg-secondary shadow">
                                <div class="card-header bg-white border-0">
                                    <div class="row align-items-center">
                                        <div class="col-8">
                                            <h3 class="mb-0">Consultas</h3>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <form onSubmit={this.consultas}>

                                        <div class="row align-items-center">
                                            <div class="col-6">
                                                <h6 class="heading-small text-muted mb-4">Dato a Consultar</h6>
                                            </div>
                                            <div class="col-6 text-right">
                                                <button type="submit" class="btn btn-sm btn-default btn-lg btn-block">Consultar</button>
                                            </div>
                                        </div>
                                        <div class="pl-lg-4 mt-4">
                                            <div class="row">
                                                <div class="col-lg-6">
                                                    <div class="form-group">
                                                        <label class="form-control-label" for="input-last-name">Digita el tipo de dato</label>
                                                        <div class="form-group">
                                                            <select class="form-control form-control-alternative" id="exampleFormControlSelect1" onChange={e => this.opcionbusqueda = e.target.value} required>
                                                                <option>Seleccionar</option>
                                                                <option>Nombre</option>
                                                                <option>Nombre de usuario</option>
                                                                <option>Correo</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-6">
                                                    <div class="form-group">
                                                        <label class="form-control-label" for="input-last-name">Escribe el dato</label>
                                                        <div class="input-group input-group-merge input-group-alternative mb-0">
                                                            <div class="input-group-prepend">
                                                                <span class="input-group-text"><i class="fas fa-search text-blue"></i></span>
                                                            </div>
                                                            <input class="form-control" placeholder="Search" type="text" onChange={e => this.cajatexto = e.target.value} required />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>


                        <div class="col-xl-6 order-xl-2 mx-auto">
                            <div class="card bg-secondary shadow">
                                <div class="card-header bg-white border-0">
                                    <form onSubmit={this.mostartodo}>
                                        <div class="row align-items-center">
                                            <div class="col-5">
                                                <h3 class="mb-0">Mostrar Todos</h3>
                                            </div>
                                            <div class="col-7">
                                                <button type="submit" className="btn btn-default btn-lg btn-block">Mostrar Todos</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>


                        <div class="col-xl-12 order-xl-2">
                            <div class="card shadow">
                                <div class="card-header border-0">
                                    <div class="row align-items-center">
                                        <div class="col">
                                            <h3 class="mb-0">Clientes</h3>
                                        </div>
                                    </div>
                                </div>
                                <div class="table-responsive">
                                    <table class="table align-items-center table-flush">
                                        <thead class="thead-light">
                                            <tr>
                                                <th scope="col">Nombre</th>
                                                <th scope="col">Nombre de usuario</th>
                                                <th scope="col">correo</th>
                                                <th scope="col">opcion</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.Tusuarios.map(user => {
                                                    return (
                                                        <tr key={user._id}>
                                                            <td>{user.name}</td>
                                                            <td>{user.username}</td>
                                                            <td>{user.email}</td>
                                                            <td>
                                                                 <button className="btn btn-sm btn-danger" onClick={() => this.eliminarusuario(user._id)}><i class="fas fa-user-minus"></i></button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
                <Modal
                    className={`modal-dialog-centered modal-${this.state.datoserror.color}`}
                    contentClassName={`bg-${this.state.datoserror.color}`}
                    isOpen={this.state.notificationModal}
                    toggle={() => this.toggleModal("notificationModal")}
                >
                    <div className="modal-header">
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => this.toggleModal("notificationModal")}
                        >
                            <span aria-hidden={true}>×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="py-3 text-center">
                            <i className={`fas fa-${this.state.datoserror.icon} ni-5x`} />
                            <h4 className="heading mt-4">Alerta</h4>
                            <p>
                                {this.state.mensaje}
                            </p>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <Button
                            className="text-white ml-auto"
                            color="link"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => this.toggleModal("notificationModal")}
                        >
                            Close
                </Button>
                    </div>
                </Modal>


                <Modal
                    className="modal-dialog-centered"
                    size="sm"
                    isOpen={this.state.formModal2}
                    toggle={() => this.toggleModal("formModal2")}
                >
                    <div className="modal-body p-0">
                        <Card className="bg-secondary shadow border-0">
                            <CardBody className="px-lg-5 py-lg-5">
                                <div className="text-center text-muted mb-4">
                                    <h2>Actualizar Cliente </h2>
                                    <p>Vas a actualizar los datos de <h4>{this.state.usuario.name}</h4></p>
                                </div>
                                <Form role="form" onSubmit={this.actualizar2}>
                                    <FormGroup className="mb-3">
                                        <InputGroup className="input-group-alternative">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="text" onChange={e => this.name = e.target.value} placeholder={`Nombre: ${this.state.usuario.name}`} required />
                                        </InputGroup>
                                    </FormGroup>
                                    <FormGroup>
                                        <InputGroup className="input-group-alternative">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="number" onChange={e => this.telefono = e.target.value} placeholder={`Telefono: ${this.state.usuario.telefono}`} required />
                                        </InputGroup>
                                    </FormGroup>
                                    <FormGroup>
                                        <InputGroup className="input-group-alternative">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="email" onChange={e => this.correo = e.target.value} placeholder={`Correo: ${this.state.usuario.correo}`} required />
                                        </InputGroup>
                                    </FormGroup>


                                    <div className="text-center">
                                        <Button
                                            className="my-4"
                                            color="primary"
                                            type="submit"
                                        >
                                            Actualizar
                        </Button>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </div>
                </Modal>

            </div>
        )
    }
}