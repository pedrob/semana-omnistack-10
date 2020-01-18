import React from 'react';
import './styles.css';

export default function DevItem({ dev, onRemove }) {
	async function handleRemove(username) {
		await onRemove(username);
	}

	return (
		<li key={dev._id} className="dev-item">
			<header>
				<img src={dev.avatar_url} alt={dev.name} />
				<div className="user-info">
					<strong>{dev.name}</strong>
					<span>{dev.techs.join(', ')}</span>
				</div>
				<button
					className="btn-remove"
					title="Remover usuário"
					onClick={() => handleRemove(dev.github_username)}
				>
					x
				</button>
			</header>
			<p>{dev.bio}</p>
			<a href={`https://github.com/${dev.github_username}`}>
				Acessar perfil no Github
			</a>
		</li>
	);
}
