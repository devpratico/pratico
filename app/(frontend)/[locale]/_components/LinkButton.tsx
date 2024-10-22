import { Button, ButtonProps } from "@radix-ui/themes";
import { Link } from "../../_intl/intlNavigation";

interface LinkButtonProps extends ButtonProps {
    href?: string;
    target?: string;
}

export default function LinkButton({ href = "", target, children, ...props }: LinkButtonProps) {
    return (
        <Button {...props} asChild>
            <Link href={href} target={target}>
                {children}
            </Link>
        </Button>
    );
}