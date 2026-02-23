import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const PrivacyPolicy = () => {
  const lastUpdated = '23 de febrero de 2026';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-16 px-4 relative z-10"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-nexus-cyan-glow/70 hover:text-nexus-cyan-glow transition-colors mb-8 text-sm"
        >
          ← Volver al inicio
        </Link>

        <h1 className="text-3xl font-orbitron font-bold text-white mb-2">
          Política de Privacidad
        </h1>
        <p className="text-white/40 text-sm mb-10">
          Última actualización: {lastUpdated}
        </p>

        <div className="space-y-8 text-white/70 leading-relaxed text-sm">
          {/* 1 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Responsable del Tratamiento</h2>
            <p>
              <strong className="text-white/90">AIGestion</strong> ("nosotros") es responsable del tratamiento de los datos personales recogidos a través de{' '}
              <a href="https://www.aigestion.net" className="text-nexus-cyan-glow hover:underline">www.aigestion.net</a>{' '}
              y sus servicios asociados. Contacto:{' '}
              <a href="mailto:admin@aigestion.net" className="text-nexus-cyan-glow hover:underline">admin@aigestion.net</a>.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Datos que Recopilamos</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-white/90">Datos de cuenta:</strong> nombre, email, teléfono al registrarse.</li>
              <li><strong className="text-white/90">Datos de uso:</strong> interacciones con la plataforma, logs de sesión, preferencias.</li>
              <li><strong className="text-white/90">Datos de integraciones:</strong> tokens OAuth de servicios de terceros (Notion, Google, etc.) que el usuario conecte voluntariamente.</li>
              <li><strong className="text-white/90">Datos técnicos:</strong> dirección IP, tipo de navegador, dispositivo, para seguridad y rendimiento.</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Finalidad del Tratamiento</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Provisión y mejora de nuestros servicios de gestión empresarial con IA.</li>
              <li>Autenticación y seguridad de la cuenta.</li>
              <li>Sincronización con servicios de terceros autorizados por el usuario.</li>
              <li>Comunicaciones sobre el servicio (nunca spam comercial no solicitado).</li>
              <li>Cumplimiento de obligaciones legales.</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Base Legal</h2>
            <p>
              Tratamos datos basándonos en: (a) la ejecución del contrato de servicio, (b) consentimiento explícito para integraciones de terceros, (c) interés legítimo para seguridad y mejora del servicio, y (d) cumplimiento de obligaciones legales aplicables (RGPD, LOPDGDD).
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Integraciones con Terceros</h2>
            <p>
              Al conectar servicios externos (como Notion, Google Workspace, Stripe), AIGestion accede únicamente a los datos que el usuario autoriza expresamente a través de OAuth. Los tokens se almacenan cifrados y pueden ser revocados en cualquier momento desde el panel de usuario o directamente en el servicio de terceros.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Conservación de Datos</h2>
            <p>
              Los datos se conservan mientras la cuenta esté activa. Tras la eliminación de la cuenta, los datos se eliminan en un plazo de 30 días, salvo obligación legal de conservación.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Derechos del Usuario</h2>
            <p>
              De acuerdo con el RGPD y la LOPDGDD, usted tiene derecho de acceso, rectificación, supresión, portabilidad, limitación y oposición. Puede ejercer estos derechos contactando a{' '}
              <a href="mailto:admin@aigestion.net" className="text-nexus-cyan-glow hover:underline">admin@aigestion.net</a>.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Seguridad</h2>
            <p>
              Implementamos cifrado en tránsito (TLS) y en reposo, control de acceso basado en roles, y monitorización continua para proteger sus datos.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Contacto</h2>
            <p>
              Para cualquier consulta sobre privacidad:{' '}
              <a href="mailto:admin@aigestion.net" className="text-nexus-cyan-glow hover:underline">admin@aigestion.net</a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-white/30 text-xs text-center">
          © 2026 AIGestion. Todos los derechos reservados.
        </div>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;
