import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

export async function POST(request: Request) {
  try {
    // 1. VÉRIFICATION DE LA SÉCURITÉ
    // N8N doit envoyer le header "Authorization: Bearer <N8N_WEBHOOK_SECRET>"
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.N8N_WEBHOOK_SECRET}`) {
      console.warn("Tentative d'accès non autorisée au Webhook N8N.");
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // 2. LECTURE DU PAYLOAD N8N
    const body = await request.json();
    const { event_type, data } = body;

    if (!event_type || !data) {
      return NextResponse.json({ error: 'Payload invalide. "event_type" et "data" sont requis.' }, { status: 400 });
    }

    // 3. ROUTAGE DE L'ACTION SELON L'ÉVÉNEMENT
    switch (event_type) {
      
      case 'sync_session':
        // Synchronisation d'une session (Digiforma / Nell App)
        const { error: sessionError } = await supabaseAdmin
          .from('training_sessions')
          .upsert({
            external_id_digiforma: data.external_id_digiforma || null,
            external_id_nellapp: data.external_id_nellapp || null,
            title: data.title,
            start_date: data.start_date,
            end_date: data.end_date,
            status: data.status,
          }, { 
            onConflict: data.external_id_digiforma ? 'external_id_digiforma' : 'external_id_nellapp' 
          });

        if (sessionError) throw sessionError;
        break;

      case 'sync_student':
        // Synchronisation d'un apprenant (Nell App)
        const { error: studentError } = await supabaseAdmin
          .from('students')
          .upsert({
            external_id_nellapp: data.external_id_nellapp,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            session_id: data.session_id, // L'ID uuid de la session (déjà créée dans Supabase)
            status: data.status,
          }, { onConflict: 'external_id_nellapp' });

        if (studentError) throw studentError;
        break;

      case 'sync_invoice':
        // Synchronisation d'une facture (Inqom)
        const { error: invoiceError } = await supabaseAdmin
          .from('invoices')
          .upsert({
            external_id_inqom: data.external_id_inqom,
            student_id: data.student_id, // L'ID uuid de l'apprenant dans Supabase
            session_id: data.session_id, // L'ID uuid de la session dans Supabase
            amount_ht: data.amount_ht,
            amount_ttc: data.amount_ttc,
            status: data.status,
            due_date: data.due_date,
            pdf_url: data.pdf_url || null,
          }, { onConflict: 'external_id_inqom' });

        if (invoiceError) throw invoiceError;
        break;

      case 'sync_crm':
        // Synchronisation d'une opportunité (Hubspot)
        const { error: crmError } = await supabaseAdmin
          .from('crm_opportunities')
          .upsert({
            external_id_hubspot: data.external_id_hubspot,
            deal_name: data.deal_name,
            stage: data.stage,
            amount: data.amount,
            probability: data.probability,
            close_date: data.close_date,
          }, { onConflict: 'external_id_hubspot' });

        if (crmError) throw crmError;
        break;

      default:
        return NextResponse.json({ error: `Type d'événement inconnu : ${event_type}` }, { status: 400 });
    }

    // 4. RÉPONSE DE SUCCÈS POUR N8N
    return NextResponse.json({ 
      success: true, 
      message: `Événement '${event_type}' traité et base de données mise à jour avec succès.` 
    }, { status: 200 });

  } catch (error: any) {
    console.error(`Erreur critique dans le Webhook N8N:`, error.message || error);
    return NextResponse.json({ error: error.message || 'Erreur interne du serveur lors du traitement.' }, { status: 500 });
  }
}