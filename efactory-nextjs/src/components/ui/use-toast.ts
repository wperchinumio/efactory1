export interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

// Simple toast implementation using console for now
export const toast = (props: ToastProps) => {
  // For now, just log to console - in a real app you'd use a proper toast system
  if (props.variant === 'destructive') {
    console.error(`${props.title}${props.description ? ': ' + props.description : ''}`);
  } else {
    console.log(`${props.title}${props.description ? ': ' + props.description : ''}`);
  }
  
  // You could also show a browser notification
  if ('Notification' in window && Notification.permission === 'granted') {
    const options: NotificationOptions = {
      ...(props.description ? { body: props.description } as NotificationOptions : {}),
      icon: '/favicon.ico'
    };
    new Notification(props.title, options);
  }
};

export const useToast = () => {
  return { toast };
};
