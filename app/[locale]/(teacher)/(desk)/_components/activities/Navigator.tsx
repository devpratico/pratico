import { Box, Flex, IconButton } from '@radix-ui/themes';
import { ChevronLeft, ChevronRight } from 'lucide-react';




interface NavigatorProps {
    total: number
    currentQuestionIndex: number
    setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>
}

export default function Navigator({ total, currentQuestionIndex, setCurrentQuestionIndex }: NavigatorProps) {
    const canGoNext = currentQuestionIndex < total - 1
    const canGoPrevious = currentQuestionIndex > 0
    function handleNext() { if (canGoNext) setCurrentQuestionIndex((prev) => prev + 1) }
    function handlePrevious() { if (canGoPrevious) setCurrentQuestionIndex((prev) => prev - 1) }

    if (total <= 1) return null

    return (
        <Flex gap='3' align='center' width='min-content'>

            <IconButton radius='full' variant='ghost' onClick={handlePrevious} disabled={!canGoPrevious}>
                <ChevronLeft />
            </IconButton>

            {Array.from({ length: total }).map((_, index) => (
                <Box
                    key={index} width='6px' height='6px'
                    style={{ borderRadius: '50%', backgroundColor: index === currentQuestionIndex ? 'var(--accent-10)' : 'var(--gray-7)' }}
                    display={total > 1 ? 'block' : 'none'}
                />
            ))}


            <IconButton radius='full' variant='ghost' onClick={handleNext} disabled={!canGoNext}>
                <ChevronRight />
            </IconButton>

        </Flex>
    )
}