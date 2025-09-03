import React 	from 'react'

const LoadingComponent = () => {
	return (
		<div 
			className="loading-progress-btn" 
			role="progressbar" 
		>
			<div className="loading-part" style={{ animationDelay : '0s' }}>
				<div className="loading-part-inner" style={{ transform: 'rotate(0deg) translate(5.44px, 0px)'}}>
				</div>
			</div>

			<div className="loading-part" style={{ animationDelay : '0.8s' }}>
				<div className="loading-part-inner" style={{ transform: 'rotate(30deg) translate(5.44px, 0px)'}}>
				</div>
			</div>
			<div className="loading-part" style={{ animationDelay : '0.16s' }}>
				<div className="loading-part-inner" style={{ transform: 'rotate(60deg) translate(5.44px, 0px)'}}>
				</div>
			</div>
			<div className="loading-part" style={{ animationDelay : '0.24s' }}>
				<div className="loading-part-inner" style={{ transform: 'rotate(90deg) translate(5.44px, 0px)'}}>
				</div>
			</div>
			<div className="loading-part" style={{ animationDelay : '0.32s' }}>
				<div className="loading-part-inner" style={{ transform: 'rotate(120deg) translate(5.44px, 0px)'}}>
				</div>
			</div>
			<div className="loading-part" style={{ animationDelay : '0.40s' }}>
				<div className="loading-part-inner" style={{ transform: 'rotate(150deg) translate(5.44px, 0px)'}}>
				</div>
			</div>
			<div className="loading-part" style={{ animationDelay : '0.48s' }}>
				<div className="loading-part-inner" style={{ transform: 'rotate(180deg) translate(5.44px, 0px)'}}>
				</div>
			</div>
			<div className="loading-part" style={{ animationDelay : '0.56s' }}>
				<div className="loading-part-inner" style={{ transform: 'rotate(210deg) translate(5.44px, 0px)'}}>
				</div>
			</div>
			<div className="loading-part" style={{ animationDelay : '0.64s' }}>
				<div className="loading-part-inner" style={{ transform: 'rotate(240deg) translate(5.44px, 0px)'}}>
				</div>
			</div>
			<div className="loading-part" style={{ animationDelay : '0.74s' }}>
				<div className="loading-part-inner" style={{ transform: 'rotate(270deg) translate(5.44px, 0px)'}}>
				</div>
			</div>
			<div className="loading-part" style={{ animationDelay : '0.82s' }}>
				<div className="loading-part-inner" style={{ transform: 'rotate(300deg) translate(5.44px, 0px)'}}>
				</div>
			</div>
			<div className="loading-part" style={{ animationDelay : '0.95s' }}>
				<div className="loading-part-inner" style={{ transform: 'rotate(330deg) translate(5.44px, 0px)'}}>
				</div>
			</div>
		</div>
	)
}

export default React.memo(LoadingComponent)