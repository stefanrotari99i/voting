import React from 'react'
import './Privacy.css'

export const Delete = () => {
    return (
        <div className='privacy'>
            <h1>Solicitare de ștergere a datelor cu caracter personal</h1>
            <p>
            Siteul nostru nu stochează datele dumneavoastră personale; este folosit doar pentru autentificare. 
            <br/>
            În conformitate cu regulile platformei Facebook, trebuie să furnizăm URL-ul de apel invers pentru ștergerea datelor utilizatorului sau URL-ul instrucțiunilor de ștergere a datelor. Dacă doriți să vă ștergeți activitățile pentru ERASMUS+, urmați aceste instrucțiuni:
            <ul>
            <li>Accesați setarea și confidențialitatea contului dvs. Facebook. Faceți clic pe „Setare”.</li>
            <li>Apoi, accesați „Aplicații și site-uri” și veți vedea toate activitățile dvs. din aplicații.</li>
            <li>Selectați caseta de opțiuni pentru ERASMUS</li>
            <li>Faceți clic pe butonul „Eliminare”.</li>
            </ul>
            </p>
        </div>
    )
}