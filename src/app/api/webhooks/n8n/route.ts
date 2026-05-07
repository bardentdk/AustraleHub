import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

export async function POST(request: Request) {
  try {
    // 1. VÉRIFICATION DE LA SÉCURITÉ (Optimisée)
    const authHeader = request.headers.get('authorization');
    
    // On extrait le token (en ignorant "Bearer ") et on nettoie les espaces
    const providedToken = authHeader?.replace(/^Bearer\s+/i, '')?.trim();
    const expectedToken = process.env.N8N_WEBHOOK_SECRET?.trim();

    // Logs pour le débogage sur Vercel
    console.log("=== DEBUG WEBHOOK N8N ===");
    console.log("Token fourni par N8N :", providedToken);
    console.log("Token attendu (Vercel) :", expectedToken ? "***** (Variable trouvée)" : "UNDEFINED (Variable introuvable)");

    if (!providedToken || providedToken !== expectedToken) {
      console.warn("Tentative d'accès non autorisée.");
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

      // ... (Le reste de tes cases sync_student, sync_invoice, sync_crm restent identiques)
      // Je les omet ici pour la lisibilité, mais garde-les dans ton fichier !

      default:
        return NextResponse.json({ error: `Type d'événement inconnu : ${event_type}` }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Événement '${event_type}' traité avec succès.` 
    }, { status: 200 });

  } catch (error: any) {
    console.error(`Erreur critique Webhook :`, error.message || error);
    return NextResponse.json({ error: error.message || 'Erreur interne' }, { status: 500 });
  }
}