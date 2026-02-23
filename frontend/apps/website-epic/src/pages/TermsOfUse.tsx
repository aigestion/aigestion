import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const TermsOfUse = () => {
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
          Términos de Uso
        </h1>
        <p className="text-white/40 text-sm mb-10">
          Última actualización: {lastUpdated}
        </p>

        <div className="space-y-8 text-white/70 leading-relaxed text-sm">
          {/* 1 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Aceptación de los Términos</h2>
            <p>
              Al acceder o utilizar AIGestion (<a href="https://www.aigestion.net" className="text-nexus-cyan-glow hover:underline">www.aigestion.net</a>), usted acepta estos Términos de Uso. Si no está de acuerdo, no utilice la plataforma.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Descripción del Servicio</h2>
            <p>
              AIGestion es una plataforma de gestión empresarial potenciada por inteligencia artificial que ofrece herramientas de productividad, automatización, integraciones con servicios de terceros y asistencia virtual.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Registro y Cuenta</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Debe proporcionar información veraz y mantenerla actualizada.</li>
              <li>Es responsable de la confidencialidad de sus credenciales.</li>
              <li>Debe notificarnos inmediatamente cualquier uso no autorizado.</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Uso Aceptable</h2>
            <p className="mb-2">El usuario se compromete a no:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Utilizar la plataforma para actividades ilegales o fraudulentas.</li>
              <li>Intentar acceder a sistemas o datos no autorizados.</li>
              <li>Interferir con el funcionamiento normal del servicio.</li>
              <li>Realizar ingeniería inversa del software.</li>
              <li>Revender o redistribuir el servicio sin autorización.</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Integraciones con Terceros</h2>
            <p>
              AIGestion permite conectar servicios externos (Notion, Google, etc.) mediante OAuth. Al autorizar una integración, usted acepta las políticas de privacidad del servicio de terceros correspondiente. AIGestion no se responsabiliza de los cambios en las API o políticas de terceros.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Propiedad Intelectual</h2>
            <p>
              Todo el contenido, diseño, código y marca de AIGestion son propiedad exclusiva de AIGestion. El contenido generado por el usuario le pertenece; AIGestion no reclama derechos sobre los datos del usuario.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Disponibilidad del Servicio</h2>
            <p>
              Nos esforzamos por mantener una disponibilidad alta, pero no garantizamos un servicio ininterrumpido. Nos reservamos el derecho de realizar mantenimiento programado con aviso previo razonable.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Limitación de Responsabilidad</h2>
            <p>
              AIGestion se proporciona "tal cual". En la medida permitida por la ley, no seremos responsables de daños indirectos, incidentales o consecuentes derivados del uso de la plataforma.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Rescisión</h2>
            <p>
              Puede cancelar su cuenta en cualquier momento. Nos reservamos el derecho de suspender o eliminar cuentas que violen estos términos, con notificación previa cuando sea posible.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">10. Ley Aplicable</h2>
            <p>
              Estos términos se rigen por la legislación española y de la Unión Europea. Cualquier disputa se someterá a los juzgados y tribunales competentes.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">11. Contacto</h2>
            <p>
              Para consultas sobre estos términos:{' '}
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

export default TermsOfUse;
