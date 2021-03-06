import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi';
import './style.css';
import logoImg from '../../assets/logo.svg';

import api from '../../services/api'

export default function Profile() {
    const [incidents, setIncidents] = useState([]);
    const ongId = localStorage.getItem('ongId');
    const ongName = localStorage.getItem('ongName');
    const history = useHistory();

    useEffect(() => {
        api.get('profile', { //Pegar todos os incidents rota profile
            //pegar infos do usuário logado
            headers: {
                Authorization: ongId,
            }
        }).then(Response => { //para pegar os dados
            setIncidents(Response.data);
        }) 
    }, [ongId]); 

    async function handleDeleteIncident(id) {
        try{
            await api.delete(`incidents/${id}`,
            {
                headers: {
                    Authorization: ongId,
                }
            });

            setIncidents(incidents.filter(incident => incident.id !== id)); 
        } catch (err) {
            alert('Erro ao deletar caso. Tente novamente!');
        }
    }

    function handleLogout() {
        localStorage.clear();
        history.push('/');
    }
    
    return (
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Be The Hero"/>
                <span>Bem vinda, {ongName} </span>

                <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>

                <button onClick={handleLogout} type="button">
                    <FiPower size={18} color="#E02041" />
                </button>
            </header>
            
            <h1>Casos cadastrados</h1>
            <ul>
               {incidents.map(incident => (
                    <li key={incident.id}>
                    <strong>CASO:</strong>
                    <p>{incident.title}</p>

                    <strong>Descrição:</strong>
                    <p>{incident.description}</p>

                    <strong>Valor:</strong>
                    <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(incident.value)}</p>

                    <button onClick={() => handleDeleteIncident(incident.id)} type="button"> {/* necesidade de utilizar um arrow function no onClick para que ele capte a função e não o retorno dela */}
                        <FiTrash2 size={20} color="a8a8b3" />
                    </button>
                </li>
               ))}
            </ul>
        </div>
    );    
}