import { motion } from 'framer-motion';
import { Check, CreditCard, ExternalLink, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { billingService, BillingSnapshot } from '../services/billing.service';

const tiers = [
  {
    name: 'Esencial',
    priceId: 'price_1QjKIJNHiQCSTOYx5Z...PLACHOLDER', // Replace with real Price ID
    price: '$490',
    frequency: '/mes',
    description: 'Startups y pymes en crecimiento',
    features: [
      'Automatización base',
      'Panel de control',
      'Soporte estándar',
      'Implementación rápida',
    ],
  },
  {
    name: 'Evolución',
    priceId: 'price_1QjKIJNHiQCSTOYx...PLACEHOLDER', // Replace with real Price ID
    price: '$1,490',
    frequency: '/mes',
    description: 'Empresas con equipos multi-área',
    features: [
      'IA aplicada por área',
      'Integraciones CRM/ERP',
      'Reportes avanzados',
      'Onboarding guiado',
    ],
    popular: true,
  },
  {
    name: 'Soberano',
    priceId: '', // Custom quote
    price: 'Cotización',
    frequency: '',
    description: 'Corporativos y sector público',
    features: ['Modelos privados', 'Gobernanza y compliance', 'Equipo dedicado', 'SLA premium'],
  },
];

export const BillingDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<BillingSnapshot | null>(null);
  const { notify } = useNotification();

  useEffect(() => {
    loadBillingData();

    // Check for success param from Stripe redirect
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      notify('¡Pago Exitoso!', 'Tu suscripción ha sido activada.', 'success');
      // Redirect to Client Dashboard after short delay
      setTimeout(() => {
        window.location.href = '/client';
      }, 2000);
    }
  }, []);

  const loadBillingData = async () => {
    try {
      const data = await billingService.getBillingSnapshot();
      setSnapshot(data);
    } catch (error) {
      console.error('Error loading billing data:', error);
      notify('Error', 'No se pudo cargar la información de facturación.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (priceId: string) => {
    if (!priceId) {
      notify(
        'Contactar Ventas',
        'Para el plan Soberano, por favor contáctanos directamente.',
        'info'
      );
      return;
    }

    setProcessing(priceId);
    try {
      const { url } = await billingService.createCheckoutSession(priceId);
      window.location.href = url;
    } catch (error: any) {
      console.error('Checkout error:', error);
      notify('Error', error.message || 'Error al iniciar el checkout.', 'error');
      setProcessing(null);
    }
  };

  const handlePortal = async () => {
    setProcessing('portal');
    try {
      const { url } = await billingService.createPortalSession();
      window.location.href = url;
    } catch (error: any) {
      console.error('Portal error:', error);
      notify('Error', error.message || 'Error al abrir el portal de facturación.', 'error');
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-nexus-obsidian pt-24 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-nexus-cyan animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nexus-obsidian pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-orbitron font-bold text-white mb-4">
            Facturación y <span className="text-nexus-cyan text-glow">Suscripción</span>
          </h1>
          <p className="text-nexus-silver/70">
            Gestiona tu plan, método de pago e historial de facturación.
          </p>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-16 backdrop-blur-sm"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                Estado de Suscripción
                {snapshot?.hasActiveSubscription ? (
                  <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/30">
                    ACTIVO
                  </span>
                ) : (
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs px-3 py-1 rounded-full border border-yellow-500/30">
                    INACTIVO
                  </span>
                )}
              </h2>
              {snapshot?.subscription ? (
                <p className="text-nexus-silver">
                  Plan actual:{' '}
                  <span className="text-white font-semibold">
                    {snapshot.subscription.plan.interval === 'month' ? 'Mensual' : 'Anual'}
                  </span>{' '}
                  • Renueva el{' '}
                  {new Date(snapshot.subscription.current_period_end * 1000).toLocaleDateString()}
                </p>
              ) : (
                <p className="text-nexus-silver">No tienes una suscripción activa actualmente.</p>
              )}
            </div>

            {snapshot?.hasActiveSubscription && (
              <button
                onClick={handlePortal}
                disabled={processing === 'portal'}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-all border border-white/10 disabled:opacity-50"
              >
                {processing === 'portal' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ExternalLink className="w-5 h-5" />
                )}
                Gestionar en Stripe
              </button>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        {!snapshot?.hasActiveSubscription && (
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 rounded-3xl border backdrop-blur-md flex flex-col ${
                  tier.popular
                    ? 'border-nexus-cyan/50 bg-nexus-cyan/5 shadow-[0_0_30px_rgba(6,182,212,0.15)]'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-nexus-cyan text-black font-bold text-xs px-4 py-1 rounded-full tracking-wider uppercase">
                    Más Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-nexus-cyan font-orbitron tracking-widest text-sm uppercase mb-2">
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{tier.price}</span>
                    <span className="text-nexus-silver/70 text-sm">{tier.frequency}</span>
                  </div>
                  <p className="text-sm text-nexus-silver mt-4">{tier.description}</p>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {tier.features.map(feature => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-nexus-silver/90"
                    >
                      <Check className="w-5 h-5 text-nexus-cyan shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(tier.priceId)}
                  disabled={processing === tier.priceId}
                  className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    tier.popular
                      ? 'bg-nexus-cyan text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                      : 'bg-white text-black hover:bg-white/90'
                  } disabled:opacity-50`}
                >
                  {processing === tier.priceId ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {tier.priceId ? 'Comenzar Ahora' : 'Contactar Ventas'}
                      {tier.priceId && <CreditCard className="w-4 h-4" />}
                    </>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Invoice History (Simplified) */}
        {snapshot?.invoices && snapshot.invoices.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-orbitron font-bold text-white mb-6">Historial de Pagos</h3>
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-nexus-silver text-sm uppercase tracking-wider">
                  <tr>
                    <th className="p-6 font-normal">Fecha</th>
                    <th className="p-6 font-normal">Monto</th>
                    <th className="p-6 font-normal">Estado</th>
                    <th className="p-6 font-normal text-right">Factura</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {snapshot.invoices.map(invoice => (
                    <tr key={invoice.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-6 text-white">
                        {new Date(invoice.created * 1000).toLocaleDateString()}
                      </td>
                      <td className="p-6 text-white font-mono">
                        ${(invoice.amount_paid / 100).toFixed(2)} {invoice.currency.toUpperCase()}
                      </td>
                      <td className="p-6">
                        <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/30 capitalize">
                          {invoice.status}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <a
                          href={invoice.pdf_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-nexus-cyan hover:underline text-sm inline-flex items-center gap-1"
                        >
                          Descargar <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
