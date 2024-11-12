import { HTMLContainer, Rectangle2d, ShapeUtil } from 'tldraw'
import { TLBaseShape } from 'tldraw'

type CardShape = TLBaseShape<'card', { w: number; h: number, color: string }>
export class CardShapeUtil extends ShapeUtil<CardShape> {
	static override type = 'card' as const

	getDefaultProps(): CardShape['props'] {
		return {
			w: 1920,
			h: 1080,
			color: '#000000'
		}
	}

	getGeometry(shape: CardShape) {
		return new Rectangle2d({
			width: shape.props.w,
			height: shape.props.h,
			isFilled: true,
		})
	}

	component(shape: CardShape) {
		return <HTMLContainer>
			<div style={{ width: '100%', height: '100%', border: `solid 10px ${shape.props.color}` }}>
				Hello
			</div>
		</HTMLContainer>
	}

	indicator(shape: CardShape) {
		return <rect width={shape.props.w} height={shape.props.h} fill={shape.props.color} />
	}
}

