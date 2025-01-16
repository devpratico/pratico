"use client";

import { Container } from "@radix-ui/themes";

export default function PlayGround () {
	if (process.env.NODE_ENV === 'production') {
		return (null);
	}

    return (
		<Container>
		</Container>
);
};

