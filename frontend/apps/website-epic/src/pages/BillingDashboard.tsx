import { motion } from 'framer-motion';
import { Check, CreditCard, ExternalLink, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { billingService, BillingSnapshot } from '../services/billing.service';
import { GodModeText } from '../components/design-system/GodModeText';
import { TiltCard } from '../components/design-system/TiltCard';

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
    <div className="min-h-screen bg-nexus-obsidian pt-24 pb-12 px-6 selection:bg-nexus-cyan/30 relative overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-nexus-cyan/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-nexus-violet/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center md:text-left"
        >
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <GodModeText
              text="CENTRO DE"
              effect="none"
              className="text-5xl md:text-6xl font-bold"
            />
            <GodModeText
              text="FACTURACIÓN"
              className="text-5xl md:text-6xl font-bold text-nexus-cyan"
            />
          </div>
          <p className="text-nexus-silver/80 text-lg font-light tracking-wide max-w-2xl">
            Gestiona tu soberanía digital. Control total sobre tu plan, recursos e historial de
            inversiones de inteligencia.
          </p>
        </motion.div>

        {/* Status Card - God Mode */}
        {/* @ts-ignore */}
        <TiltCard tiltMaxAngleX={2} tiltMaxAngleY={2} className="mb-20">
          <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-nexus-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
              <div>
                <h2 className="text-2xl font-orbitron text-white mb-3 flex items-center gap-4">
                  ESTADO DEL SISTEMA
                  {snapshot?.hasActiveSubscription ? (
                    <span className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-xs px-4 py-1.5 rounded-full border border-emerald-500/30 shadow-[0_0_15px_rgba(74,222,128,0.2)]">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      OPERATIVO
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 bg-yellow-500/10 text-yellow-400 text-xs px-4 py-1.5 rounded-full border border-yellow-500/30">
                      <span className="w-2 h-2 rounded-full bg-yellow-400" />
                      INACTIVO
                    </span>
                  )}
                </h2>
                {snapshot?.subscription ? (
                  <div className="space-y-1">
                    <p className="text-nexus-silver text-sm uppercase tracking-wider">
                      Nivel de Inteligencia Actual
                    </p>
                    <p className="text-3xl font-bold text-white tracking-tight flex items-baseline gap-2">
                      {snapshot.subscription.plan.interval === 'month' ? 'MENSUAL' : 'ANUAL'}
                      <span className="text-sm font-normal text-nexus-silver/60">
                        • Renueva:{' '}
                        {new Date(
                          snapshot.subscription.current_period_end * 1000
                        ).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                ) : (
                  <p className="text-nexus-silver/80">
                    No hay protocolos de inteligencia activos actualmente.
                  </p>
                )}
              </div>

              {snapshot?.hasActiveSubscription && (
                <button
                  onClick={handlePortal}
                  disabled={processing === 'portal'}
                  className="flex items-center gap-3 bg-nexus-cyan/10 hover:bg-nexus-cyan/20 text-nexus-cyan px-8 py-4 rounded-xl transition-all border border-nexus-cyan/50 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_35px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                >
                  {processing === 'portal' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ExternalLink className="w-5 h-5 group-hover/btn:rotate-45 transition-transform" />
                  )}
                  <span className="font-orbitron tracking-wider text-sm font-bold">
                    GESTIONAR STRIPE
                  </span>
                </button>
              )}
            </div>
          </div>
        </TiltCard>

        {/* Pricing Cards - God Mode */}
        {!snapshot?.hasActiveSubscription && (
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {tiers.map((tier, index) => (
              /* @ts-ignore */
              <TiltCard key={tier.name} className="h-full" tiltMaxAngleX={3} tiltMaxAngleY={3}>
                <div
                  className={`relative p-8 rounded-[2rem] border flex flex-col group overflow-hidden transition-all duration-500 h-full ${
                    tier.popular
                      ? 'bg-black/60 border-nexus-cyan/50 shadow-[0_0_40px_-5px_rgba(6,182,212,0.2)] hover:shadow-[0_0_60px_-5px_rgba(6,182,212,0.4)]'
                      : 'bg-black/30 border-white/5 hover:border-white/20 hover:bg-black/50'
                  }`}
                >
                  {/* Popular Glow Effect */}
                  {tier.popular && (
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-nexus-cyan/20 rounded-full blur-[60px] pointer-events-none" />
                  )}

                  {tier.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-nexus-cyan text-black font-black text-[10px] px-6 py-1.5 rounded-b-xl tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(6,182,212,0.6)] z-20">
                      Recomendado
                    </div>
                  )}

                  <div className="mb-8 relative z-10">
                    <h3
                      className={`font-orbitron tracking-[0.2em] text-sm uppercase mb-3 ${
                        tier.popular
                          ? 'text-nexus-cyan drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]'
                          : 'text-nexus-silver'
                      }`}
                    >
                      {tier.name}
                    </h3>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-5xl font-bold text-white tracking-tight">
                        {tier.price}
                      </span>
                      <span className="text-nexus-silver/60 text-sm font-light">
                        {tier.frequency}
                      </span>
                    </div>
                    <p className="text-sm text-nexus-silver/70 mt-5 leading-relaxed font-light border-t border-white/5 pt-5">
                      {tier.description}
                    </p>
                  </div>

                  <ul className="space-y-4 mb-10 flex-1 relative z-10">
                    {tier.features.map(feature => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-nexus-silver/90 group-hover:text-white transition-colors"
                      >
                        <div
                          className={`p-1 rounded-full shrink-0 ${
                            tier.popular
                              ? 'bg-nexus-cyan/10 text-nexus-cyan'
                              : 'bg-white/10 text-white'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(tier.priceId)}
                    disabled={processing === tier.priceId}
                    className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 relative overflow-hidden group/btn ${
                      tier.popular
                        ? 'bg-nexus-cyan text-black hover:bg-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                        : 'bg-white text-black hover:bg-gray-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-200%] group-hover/btn:animate-shimmer" />

                    <span className="relative z-10 font-orbitron tracking-wider text-xs">
                      {processing === tier.priceId ? (
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                      ) : (
                        <>{tier.priceId ? 'INICIAR PROTOCOLO' : 'SOLICITAR ACCESO'}</>
                      )}
                    </span>
                    {tier.priceId && !processing && (
                      <CreditCard className="w-4 h-4 relative z-10" />
                    )}
                  </button>
                </div>
              </TiltCard>
            ))}
          </div>
        )}

        {/* Invoice History - God Mode */}
        {snapshot?.invoices && snapshot.invoices.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <h3 className="text-2xl font-orbitron font-bold text-white mb-8 flex items-center gap-4">
              <span className="w-1 h-8 bg-nexus-cyan rounded-full shadow-[0_0_15px_#06b6d4]" />
              HISTORIAL DE TRANSACCIONES
            </h3>
            {/* @ts-ignore */}
            <TiltCard tiltMaxAngleX={1} tiltMaxAngleY={1}>
              <div className="bg-black/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-white/5 text-nexus-silver/60 text-xs uppercase tracking-[0.1em] font-orbitron">
                    <tr>
                      <th className="p-6 font-normal">Ciclo</th>
                      <th className="p-6 font-normal">Inversión</th>
                      <th className="p-6 font-normal">Estado</th>
                      <th className="p-6 font-normal text-right">Documento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {snapshot.invoices.map((invoice, idx) => (
                      <tr key={invoice.id} className="hover:bg-white/5 transition-colors group">
                        <td className="p-6 text-white group-hover:text-nexus-cyan transition-colors">
                          {new Date(invoice.created * 1000).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="p-6 text-white font-mono tracking-wider">
                          ${(invoice.amount_paid / 100).toFixed(2)}{' '}
                          <span className="text-xs text-nexus-silver">
                            {invoice.currency.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-6">
                          <span className="bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-bold px-3 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]">
                            COMPLETADO
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          <a
                            href={invoice.pdf_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-nexus-silver hover:text-white transition-colors text-sm inline-flex items-center gap-2 group/link"
                          >
                            <span className="text-xs uppercase tracking-wider group-hover/link:underline decoration-nexus-cyan/50 underline-offset-4">
                              PDF
                            </span>
                            <ExternalLink className="w-3 h-3 group-hover/link:text-nexus-cyan transition-colors" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TiltCard>
          </motion.div>
        )}
      </div>
    </div>
  );
};
