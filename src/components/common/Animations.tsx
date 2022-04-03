import React, { useState } from 'react';

interface AnimationProps {
    children?: any;
    duration?: number;
    style?: any;
    onPress?(): void;
}

export function FadeIn(props: AnimationProps) {
    const followUpAction = () => {
        if (props.onPress) {
            props.onPress();
        }
    };

    const [fade, setFade] = useState(false);
    return (
        <div
            style={props?.style}
            className={fade ? 'fadeIn animated' : 'animated'}
            onAnimationEnd={() => setFade(false)}
            onClick={(event) => {
                setFade(true);
                followUpAction();
            }}
        >
            {props.children}
        </div>
    );
}

interface SlideProps {
    withAnimation?: boolean;
}

export function SlideInRight(props: AnimationProps & SlideProps) {
    // const [slide, setSlide] = useState(true)

    return (
        <div
            style={props?.style}
            className="animate__animated animate__slideInRight"
        >
            {props.children}
        </div>
    );
}
