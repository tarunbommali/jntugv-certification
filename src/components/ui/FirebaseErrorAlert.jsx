import React from 'react';
import { Alert, AlertDescription, AlertIcon } from './Alert';

const FirebaseErrorAlert = ({ error, onRetry, onRefresh }) => {
  if (!error) return null;

  const getVariant = () => {
    switch (error.type) {
      case 'index':
        return 'warning';
      case 'permission':
        return 'destructive';
      case 'network':
        return 'destructive';
      default:
        return 'destructive';
    }
  };

  const getIconVariant = () => {
    switch (error.type) {
      case 'index':
        return 'warning';
      case 'permission':
        return 'destructive';
      case 'network':
        return 'destructive';
      default:
        return 'destructive';
    }
  };

  return (
    <Alert variant={getVariant()} className="mb-4">
      <AlertIcon variant={getIconVariant()} />
      <AlertDescription>
        <div className="space-y-2">
          <p className="font-medium">{error.message}</p>
          {error.type === 'index' && (
            <p className="text-sm text-muted-foreground">
              This usually happens when the database is setting up indexes for the first time.
              The page will work normally once the index is created.
            </p>
          )}
          {error.type === 'permission' && (
            <p className="text-sm text-muted-foreground">
              Please make sure you are logged in and have the necessary permissions.
            </p>
          )}
          {error.type === 'network' && (
            <p className="text-sm text-muted-foreground">
              Please check your internet connection and try again.
            </p>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default FirebaseErrorAlert;