import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { InputMask, InputMaskChangeEvent } from 'primereact/inputmask';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { Message } from 'primereact/message';
import { Dialog } from 'primereact/dialog';
import { UsuarioRequest, Moneda } from '../type/user';
import { UsuarioService } from '../service/UsuarioService';
import '../css/Registration.css';
import { RadioButton } from 'primereact/radiobutton';

const RegistrationWizard = () => {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [formData, setFormData] = useState({
        primerNombre: '',
        segundoNombre: '',
        primerApellido: '',
        segundoApellido: '',
        email: '',
        password: '',
        phone: '',
        currency: Moneda.USD as Moneda,
        notifications: true,
        subscription: 'premium_monthly',
        subscriptionType: 'mensual' as 'mensual' | 'anual'
    });
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
    const [selectedPlan, setSelectedPlan] = useState<'mensual' | 'anual'>('mensual');
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currencyOptions = [
        { label: 'Dólar Estadounidense (USD)', value: Moneda.USD },
        { label: 'Euro (EUR)', value: Moneda.EUR },
        { label: 'Peso Colombiano (COP)', value: Moneda.COP }
    ];

    const steps = [
        { label: 'Datos Personales', icon: 'pi pi-user' },
        { label: 'Información de Contacto', icon: 'pi pi-envelope' },
        { label: 'Configuración', icon: 'pi pi-cog' }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (fieldErrors[id]) {
            setFieldErrors(prev => ({ ...prev, [id]: false }));
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, password: e.target.value }));
        if (fieldErrors['password']) {
            setFieldErrors(prev => ({ ...prev, ['password']: false }));
        }
    };

    const handlePhoneChange = (e: InputMaskChangeEvent) => {
        const value = e.value || '';
        setFormData(prev => ({ ...prev, phone: value }));
        if (fieldErrors['phone']) {
            setFieldErrors(prev => ({ ...prev, phone: false }));
        }
        if (error.includes('teléfono')) {
            setError('');
        }
    };
    const handlePlanChange = (type: 'mensual' | 'anual') => {
        setFormData(prev => ({
            ...prev,
            subscriptionType: type,
            subscription: type === 'mensual' ? 'premium_monthly' : 'premium_yearly'
        }));
    };

    const handleCurrencyChange = (e: { value: string }) => {
        setFormData(prev => ({
            ...prev,
            currency: e.value as Moneda
        }));
    };

    const handleNotificationsChange = (e: CheckboxChangeEvent) => {
        setFormData(prev => ({ ...prev, notifications: e.checked as boolean }));
    };

    const validateCurrentStep = () => {
        const errors: Record<string, boolean> = {};
        let isValid = true;
        setError('');

        if (activeIndex === 0) {
            const requiredFields = ['primerNombre', 'primerApellido'];
            requiredFields.forEach(field => {
                const value = formData[field as keyof typeof formData];
                if (typeof value === 'string' && !value.trim()) {
                    errors[field] = true;
                    isValid = false;
                }
            })
            if (!isValid) {
                setError('Todos los campos son requeridos y deben estar completos');
            }
        } else if (activeIndex === 1) {
            if (!formData.phone || formData.phone.includes('_')) {
                errors['phone'] = true;
                isValid = false;
                setError('El número de teléfono es requerido y debe estar completo');
            }

            if (!formData.email.trim()) {
                errors['email'] = true;
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                setError('Por favor, introduce un correo electrónico válido.');
                isValid = false;
            }

            if (!formData.password) {
                errors['password'] = true;
                isValid = false;
            } else if (formData.password.length < 8) {
                setError('La contraseña debe tener al menos 8 caracteres.');
                isValid = false;
            }
        }

        setFieldErrors(errors);
        return isValid;
    };



    const nextStep = () => {
        setError('');
        if (validateCurrentStep()) {
            setActiveIndex(prev => prev + 1);
        }
    };

    const prevStep = () => {
        setActiveIndex(prev => prev - 1);
        setError('');
    };

    const [usuarioCreado, setUsuarioCreado] = useState(false);

    const crearUsuario = async (): Promise<boolean> => {
        if (usuarioCreado) return true;

        if (!validateCurrentStep()) return false;

        setIsSubmitting(true);
        setError('');

        const usuarioService = new UsuarioService();
        const usuario: UsuarioRequest = {
            primerNombre: formData.primerNombre,
            segundoNombre: formData.segundoNombre,
            primerApellido: formData.primerApellido,
            segundoApellido: formData.segundoApellido,
            email: formData.email,
            telefono: formData.phone.replace(/\D/g, ''),
            contrasena: formData.password,
            moneda: formData.currency,
            notificaciones: formData.notifications
        };

        try {
            await usuarioService.crearUsuario(usuario);
            setUsuarioCreado(true);
            return true;
        } catch (error: any) {
            if (error.response?.status === 409) {
                setError("Ya existe un usuario con este correo electrónico.");
            } else {
                setError("Error al registrar el usuario. Intenta nuevamente.");
            }
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleSubmit = async () => {
        const creado = await crearUsuario();
        if (creado) {
            setShowSuccessDialog(true);
            setTimeout(() => navigate('/LoginPage'), 3000);
        }
    };
    const handleComprarSuscripcion = async () => {
        const creado = await crearUsuario();
        if (!creado) return;



        try {
            const usuarioService = new UsuarioService();
            const response = await usuarioService.enviarSuscripcion(formData.subscriptionType);
            window.location.href = response;
        } catch (error) {
            console.error("Error al crear la suscripción:", error);
            setError("No se pudo redirigir a Stripe. Intenta nuevamente.");
        }
    };

    const StepIndicator = ({ step, index }: { step: { label: string, icon: string }, index: number }) => {
        const isActive = activeIndex === index;
        const isCompleted = activeIndex > index;

        return (
            <div
                className={`step-indicator ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => {
                    if (index < activeIndex || validateCurrentStep()) {
                        setActiveIndex(index);
                    }
                }}
            >
                <i className={step.icon} />
                <span>{step.label}</span>
                {isActive && <div className="step-indicator-bar" />}
            </div>
        );
    };

    const renderFieldError = (fieldName: string) => {
        return fieldErrors[fieldName] && (
            <Message
                severity="error"
                text={
                    fieldName === 'phone'
                        ? 'Número de teléfono requerido'
                        : 'Este campo es requerido'
                }
                className="field-error-message"
            />
        );
    };

    return (
        <div className="registration-container">
            <div className="registration-card">
                <div className="steps-container">
                    {steps.map((step, index) => (
                        <StepIndicator key={index} step={step} index={index} />
                    ))}
                </div>

                <Button
                    icon="pi pi-arrow-left"
                    disabled={activeIndex === 0}
                    onClick={prevStep}
                    className={`corner-button left-button ${activeIndex === 0 ? 'p-disabled' : ''}`}
                    text
                    raised
                />

                {error && <div className="error-message">{error}</div>}

                <div className="step-content">
                    {activeIndex === 0 && (
                        <div className="form-grid">
                            <div className="form-field">
                                <label htmlFor="primerNombre">Primer nombre *</label>
                                <InputText
                                    id="primerNombre"
                                    value={formData.primerNombre}
                                    onChange={handleInputChange}
                                    className={fieldErrors['primerNombre'] ? 'p-invalid' : ''}
                                />
                                {renderFieldError('primerNombre')}
                            </div>
                            <div className="form-field">
                                <label htmlFor="segundoNombre">Segundo nombre *</label>
                                <InputText
                                    id="segundoNombre"
                                    value={formData.segundoNombre}
                                    onChange={handleInputChange}
                                    className={fieldErrors['segundoNombre'] ? 'p-invalid' : ''}
                                />
                                {renderFieldError('segundoNombre')}
                            </div>
                            <div className="form-field">
                                <label htmlFor="primerApellido">Primer apellido *</label>
                                <InputText
                                    id="primerApellido"
                                    value={formData.primerApellido}
                                    onChange={handleInputChange}
                                    className={fieldErrors['primerApellido'] ? 'p-invalid' : ''}
                                />
                                {renderFieldError('primerApellido')}
                            </div>
                            <div className="form-field">
                                <label htmlFor="segundoApellido">Segundo apellido *</label>
                                <InputText
                                    id="segundoApellido"
                                    value={formData.segundoApellido}
                                    onChange={handleInputChange}
                                    className={fieldErrors['segundoApellido'] ? 'p-invalid' : ''}
                                />
                                {renderFieldError('segundoApellido')}
                            </div>
                        </div>
                    )}

                    {activeIndex === 1 && (
                        <div className="contact-form">
                            <div className="form-field">
                                <label htmlFor="email">Correo Electrónico *</label>
                                <InputText
                                    id="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={fieldErrors['email'] ? 'p-invalid' : ''}
                                />
                                {renderFieldError('email')}
                            </div>
                            <div className="form-field">
                                <label htmlFor="password">Contraseña *</label>
                                <Password
                                    inputId="password"
                                    value={formData.password}
                                    onChange={handlePasswordChange}
                                    toggleMask
                                    feedback={true}
                                    className={fieldErrors['password'] ? 'p-invalid' : ''}
                                />
                                {renderFieldError('password')}
                            </div>
                            <div className="form-field">
                                <label htmlFor="phone">Teléfono *</label>
                                <InputMask
                                    id="phone"
                                    mask="(999) 999-9999"
                                    placeholder="(999) 999-9999"
                                    value={formData.phone}
                                    onChange={handlePhoneChange}
                                    className={fieldErrors['phone'] ? 'p-invalid' : ''}
                                />
                                {renderFieldError('phone')}
                            </div>
                        </div>
                    )}

                    {activeIndex === 2 && (
                        <div className="settings-form">
                            <div className="setting-section">
                                <h3>Moneda preferida</h3>
                                <Dropdown
                                    value={formData.currency}
                                    options={currencyOptions}
                                    onChange={handleCurrencyChange}
                                    optionLabel="label"
                                    className="currency-dropdown"
                                />
                            </div>

                            <div className="setting-section">
                                <div className="checkbox-container">
                                    <Checkbox
                                        inputId="notifications"
                                        checked={formData.notifications}
                                        onChange={handleNotificationsChange}
                                    />
                                    <label htmlFor="notifications">
                                        Recibir notificaciones
                                    </label>
                                </div>
                            </div>
                            <div className="setting-section">
                                <div className="premium-subscription-section">
                                    <div className="premium-subscription-container">
                                        <h3>Suscripción Premium</h3>

                                        <div className="plan-options-container">
                                            <div
                                                className={`plan-option ${formData.subscriptionType === 'mensual' ? 'plan-option-selected' : ''}`}
                                                onClick={() => handlePlanChange('mensual')}
                                            >
                                                <div className="plan-option-content">
                                                    <RadioButton
                                                        inputId="mensual"
                                                        name="plan"
                                                        value="mensual"
                                                        checked={formData.subscriptionType === 'mensual'}
                                                        onChange={() => handlePlanChange('mensual')}
                                                    />
                                                    <label htmlFor="mensual">Plan Mensual</label>
                                                </div>
                                                <div className="plan-price">$12.00 USD /mes</div>
                                            </div>

                                            <div
                                                className={`plan-option ${formData.subscriptionType === 'anual' ? 'plan-option-selected' : ''}`}
                                                onClick={() => handlePlanChange('anual')}
                                            >
                                                <div className="plan-option-content">
                                                    <RadioButton
                                                        inputId="anual"
                                                        name="plan"
                                                        value="anual"
                                                        checked={formData.subscriptionType === 'anual'}
                                                        onChange={() => handlePlanChange('anual')}
                                                    />
                                                    <label htmlFor="anual">Plan Anual</label>
                                                </div>
                                                <div className="plan-price">$120.00 USD año</div>
                                            </div>
                                        </div>

                                        <Button
                                            label={`Comprar ${formData.subscriptionType === 'mensual' ? 'Plan Mensual' : 'Plan Anual'}`}
                                            icon="pi pi-shopping-cart"
                                            onClick={handleComprarSuscripcion}
                                            className="p-button-warning premium-purchase-button"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>

                {activeIndex < steps.length - 1 ? (
                    <Button
                        icon="pi pi-arrow-right"
                        onClick={nextStep}
                        className="corner-button right-button"
                        text
                        raised
                    />
                ) : (
                    <Button
                        icon="pi pi-check"
                        onClick={handleSubmit}
                        className="corner-button right-button success-button"
                        text
                        raised
                        loading={isSubmitting}
                    />
                )}
            </div>

            <Dialog
                visible={showSuccessDialog}
                onHide={() => {
                    setShowSuccessDialog(false);
                    navigate('/LoginPages');
                }}
                header="Registro Exitoso"
                footer={
                    <div className="dialog-footer">
                        <Button
                            label="Ir a Login"
                            icon="pi pi-sign-in"
                            onClick={() => navigate('/LoginPages')}
                            className="success-dialog-button"
                        />
                    </div>
                }
                className="compact-success-dialog"
            >
                <div className="compact-confirmation-content">
                    <i className="pi pi-check-circle confirmation-icon" />
                    <h4>¡Registro completado!</h4>
                    <p>Redirigiendo a login...</p>
                </div>
            </Dialog>
        </div>
    );
};

export default RegistrationWizard;