import { Tldraw } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'

export default function Whiteboard() {
	return (
		<div style={{ position: 'relative', width: '100%', height: '100%' }}>
			<Tldraw />
		</div>
	)
}