import { Animated } from 'react-native';
import Button from './Button';

interface SuccessReturnButtonProps {
  label: string;
  color: string;
  onPress: () => void;
  opacity: Animated.Value;
}

export default function SuccessReturnButton({
  label,
  color,
  onPress,
  opacity,
}: SuccessReturnButtonProps) {
  return (
    <Animated.View style={{ opacity }}>
      <Button
        label={label}
        variant="secondary"
        color={color}
        onPress={onPress}
      />
    </Animated.View>
  );
}
