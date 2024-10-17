import { Grid } from "@radix-ui/themes"
import WelcomeDialog from "./_components/WelcomeDialog"
import AnonWarningToast from "./_components/AnonWarningToast"

export default function Layout({children }: { children: React.ReactNode }) {


    return (
        <>
			<Grid rows={{initial: '1fr auto', xs: 'auto 1fr'}} style={{height: '100dvh', backgroundColor:'var(--accent-2)'}}>
				{children}
			</Grid>
			<WelcomeDialog />
			<AnonWarningToast />
        </>
    )
}

