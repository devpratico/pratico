import { Link as RadixLink, LinkProps as RadixLinkProps } from "@radix-ui/themes";
import { Link as NextLink } from "../../_intl/intlNavigation";


export default function Link({ href = "", children, ...props }: RadixLinkProps) {
    return (
        <RadixLink {...props} asChild>
            <NextLink href={href}>
                {children}
            </NextLink>
        </RadixLink>
    );
}