import logger from "@/app/_utils/logger";
import QuizWidget from "./QuizWidget";
import PollWidget from "./PollWidget";

export function ActivityWidget (data: any) {

	switch (data.type) {
		case 'quiz':
			return (<QuizWidget />);
		case 'poll':
			return (<PollWidget />);
		default:
			logger.warn("react:component", "ActivityWidet", "Unknown activity type", data.type);
	}
	return (null);
}