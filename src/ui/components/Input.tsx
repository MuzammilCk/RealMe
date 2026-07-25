import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef, type ReactNode, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

/**
 * Input - Inkwell-style form input with brass accents
 * ARCHITECTURE-v2 §2, §6: Premium motion, focus states
 */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input label */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Input size */
  size?: 'sm' | 'md' | 'lg';
  /** Full width */
  fullWidth?: boolean;
  /** Left adornment */
  leftAdornment?: ReactNode;
  /** Right adornment */
  rightAdornment?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      placeholder,
      error,
      helperText,
      size = 'md',
      fullWidth = true,
      leftAdornment,
      rightAdornment,
      className = '',
      style = {},
      disabled,
      required,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText && !error ? `${inputId}-helper` : undefined;

    const sizeStyles = {
      sm: { padding: '8px 12px', fontSize: '0.875rem', gap: '8px' },
      md: { padding: '12px 16px', fontSize: '1rem', gap: '10px' },
      lg: { padding: '16px 20px', fontSize: '1.125rem', gap: '12px' },
    };

    const sizes = sizeStyles[size];

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          width: fullWidth ? '100%' : 'auto',
          ...style,
        }}
        className={className}
      >
        {label && (
          <motion.label
            htmlFor={inputId}
            style={{
              fontFamily: 'var(--font-caption)',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: error ? 'var(--text-teal)' : 'var(--text-secondary)',
              transition: 'color var(--duration-fast) var(--ease-smooth)',
            }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {label} {required && <span style={{ color: 'var(--glow-ember)' }}>*</span>}
          </motion.label>
        )}

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {leftAdornment && (
            <div
              style={{
                position: 'absolute',
                left: '12px',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                zIndex: 1,
              }}
            >
              {leftAdornment}
            </div>
          )}

          <motion.input
            ref={ref}
            id={inputId}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={errorId || helperId}
            style={{
              width: '100%',
              padding: leftAdornment ? `0 16px 0 44px` : sizes.padding,
              fontFamily: 'var(--font-body)',
              fontSize: sizes.fontSize,
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              outline: 'none',
              transition: 'all var(--duration-fast) var(--ease-smooth)',
              boxSizing: 'border-box',
              ...(rightAdornment && { paddingRight: '44px' }),
            }}
            initial={{ borderColor: 'var(--border-subtle)' }}
            whileFocus={{
              borderColor: 'var(--border-strong)',
              boxShadow: '0 0 0 3px var(--border-glow)',
              backgroundColor: 'var(--bg-card)',
            }}
            animate={{
              borderColor: error ? 'var(--glow-teal)' : 'var(--border-subtle)',
              backgroundColor: disabled ? 'var(--void-800)' : 'var(--bg-input)',
            }}
            {...props}
          />

          {rightAdornment && (
            <div
              style={{
                position: 'absolute',
                right: '12px',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                zIndex: 1,
              }}
            >
              {rightAdornment}
            </div>
          )}

          {/* Brass accent line */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, var(--interactive-default), var(--interactive-hover))',
              borderRadius: '0 0 6px 6px',
              transformOrigin: 'center',
            }}
            initial={{ scaleX: 0 }}
            whileFocus={{ scaleX: 1 }}
            animate={{ scaleX: error ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        </div>

        {(error || helperText) && (
          <motion.p
            id={errorId || helperId}
            style={{
              fontFamily: 'var(--font-caption)',
              fontSize: '0.75rem',
              color: error ? 'var(--text-teal)' : 'var(--text-muted)',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            {error && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
            {error || helperText}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/**
 * Textarea - Multi-line inkwell input
 */
export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  rows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      placeholder,
      error,
      helperText,
      size = 'md',
      fullWidth = true,
      rows = 4,
      className = '',
      style = {},
      disabled,
      required,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText && !error ? `${inputId}-helper` : undefined;

    const sizeStyles = {
      sm: { padding: '8px 12px', fontSize: '0.875rem' },
      md: { padding: '12px 16px', fontSize: '1rem' },
      lg: { padding: '16px 20px', fontSize: '1.125rem' },
    };

    const sizes = sizeStyles[size];

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          width: fullWidth ? '100%' : 'auto',
          ...style,
        }}
        className={className}
      >
        {label && (
          <motion.label
            htmlFor={inputId}
            style={{
              fontFamily: 'var(--font-caption)',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: error ? 'var(--text-teal)' : 'var(--text-secondary)',
            }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {label} {required && <span style={{ color: 'var(--glow-ember)' }}>*</span>}
          </motion.label>
        )}

        <div style={{ position: 'relative' }}>
          <motion.textarea
            ref={ref}
            id={inputId}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            rows={rows}
            aria-invalid={!!error}
            aria-describedby={errorId || helperId}
            style={{
              width: '100%',
              padding: sizes.padding,
              fontFamily: 'var(--font-body)',
              fontSize: sizes.fontSize,
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              outline: 'none',
              resize: 'vertical',
              minHeight: rows * 28,
              transition: 'all var(--duration-fast) var(--ease-smooth)',
              boxSizing: 'border-box',
              lineHeight: 1.7,
            }}
            initial={{ borderColor: 'var(--border-subtle)' }}
            whileFocus={{
              borderColor: 'var(--border-strong)',
              boxShadow: '0 0 0 3px var(--border-glow)',
              backgroundColor: 'var(--bg-card)',
            }}
            animate={{
              borderColor: error ? 'var(--glow-teal)' : 'var(--border-subtle)',
              backgroundColor: disabled ? 'var(--void-800)' : 'var(--bg-input)',
            }}
            {...props}
          />

          <motion.div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, var(--interactive-default), var(--interactive-hover))',
              borderRadius: '0 0 6px 6px',
              transformOrigin: 'center',
            }}
            initial={{ scaleX: 0 }}
            whileFocus={{ scaleX: 1 }}
            animate={{ scaleX: error ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        </div>

        {(error || helperText) && (
          <motion.p
            id={errorId || helperId}
            style={{
              fontFamily: 'var(--font-caption)',
              fontSize: '0.75rem',
              color: error ? 'var(--text-teal)' : 'var(--text-muted)',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            {error && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
            {error || helperText}
          </motion.p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Input;