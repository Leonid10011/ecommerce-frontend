import React from 'react';
import styled from "@emotion/styled";
import { IconButton } from "@mui/material";

/**
 * Types for StyledIconButtonProps.
 * These props are used for custom styling and positioning of the icon button.
 */
interface StyledIconButtonProps {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
    border?: string;
    padding?: number;
}

/**
 * StyledIconButton component using emotion styled.
 * It extends the default IconButton component from Material-UI with additional styling.
 */
const StyledIconButton = styled(IconButton)<StyledIconButtonProps>`
    position: absolute;
    ${({ top }) => top !== undefined && `top: ${top}px;`}
    ${({ right }) => right !== undefined && `right: ${right}px;`}
    ${({ bottom }) => bottom !== undefined && `bottom: ${bottom}px;`}
    ${({ left }) => left !== undefined && `left: ${left}px;`}
    background-color: white;
    ${({ border }) => border && `border: ${border};`}
    ${({ padding }) => padding && `padding: ${padding}px;`}
`;

/**
 * CustomIconButtonProps types.
 * It extends StyledIconButtonProps to include additional properties for the icon button.
 */
interface CustomIconButtonProps extends StyledIconButtonProps {
    /** Icon to be displayed in the button. */
    icon: React.ReactNode;

    /** Function to handle click events on the button. */
    onClick: () => void;

    /** Accessibility label for the button. */
    ariaLabel: string;
}

/**
 * CustomIconButton component.
 * A reusable icon button component that allows custom icons, styles, and positioning.
 *
 * @param props - Props applied to the CustomIconButton component.
 * @returns A React functional component.
 */
const CustomIconButton: React.FC<CustomIconButtonProps> = ({
    icon,
    onClick,
    top,
    right,
    bottom,
    left,
    border,
    padding,
    ariaLabel
}) => {
    return (
        <StyledIconButton 
            onClick={onClick} 
            top={top}
            right={right}
            bottom={bottom}
            left={left}
            border={border}
            padding={padding}
            aria-label={ariaLabel}
        >
            {icon}
        </StyledIconButton>
    );
};

export default CustomIconButton;
