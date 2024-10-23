import LinkButton, { LinkButtonProps} from "../../_components/LinkButton"
import { Star } from 'lucide-react'


type GoPremiumBtnProps = Omit<LinkButtonProps, 'href' | 'target'>


export default function GoPremiumBtn({ ...props }: GoPremiumBtnProps) {
    const iconColor = 'var(--orange)'
    return (
        <LinkButton href='/subscribe' target='_blank' color='amber' {...props}>
            <Star color={iconColor} fill={iconColor} size='15' strokeWidth='4' />
            Passer à Pratico Pro
        </LinkButton>
    )
}