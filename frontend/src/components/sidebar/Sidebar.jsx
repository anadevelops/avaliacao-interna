import React, { useState } from "react";
import "./Sidebar.css";
import iconMembers from "../../assets/members.png";
import iconSemesters from "../../assets/semesters.png";


const Sidebar = ({ onAddMember, onAddSemester }) => {
    const [menuAberto, setMenuAberto] = useState("membros");

    const alternarMenu = (menu) => {
        setMenuAberto((menuAtual) => (menuAtual === menu ? null : menu));
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">PET Avaliação</div>
            <nav className="sidebar-nav" aria-label="Navegação principal">
                <button
                    className={`sidebar-link sidebar-toggle ${menuAberto === "membros" ? "active" : ""}`}
                    type="button"
                    aria-expanded={menuAberto === "membros"}
                    onClick={() => alternarMenu("membros")}
                >
                    <img src={iconMembers} alt="" />
                    <span>Membros</span>
                </button>
                {menuAberto === "membros" && (
                    <div className="sidebar-submenu">
                        <button type="button" onClick={onAddMember}>Adicionar</button>
                        <button type="button">Editar</button>
                        <button type="button">Excluir</button>
                    </div>
                )}

                <button
                    className={`sidebar-link sidebar-toggle ${menuAberto === "semestres" ? "active" : ""}`}
                    type="button"
                    aria-expanded={menuAberto === "semestres"}
                    onClick={() => alternarMenu("semestres")}
                >
                    <img src={iconSemesters} alt="" />
                    <span>Semestres</span>
                </button>
                {menuAberto === "semestres" && (
                    <div className="sidebar-submenu">
                        <button type="button" onClick={onAddSemester}>Adicionar</button>
                        <button type="button">Editar</button>
                        <button type="button">Excluir</button>
                    </div>
                )}
            </nav>
        </aside>
    );
};

export default Sidebar;