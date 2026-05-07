import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; // Import direct depuis supabase-js

export async function POST(request: Request) {
  try {
    // 1. VÉRIFICATION DU MOT DE PASSE N8N
    const authHeader = request.headers.get('authorization');
    const providedToken = authHeader?.replace(/^Bearer\s+/i, '')?.trim();
    const expectedToken = process.env.N8N_WEBHOOK_SECRET?.trim();

    if (!providedToken || providedToken !== expectedToken) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // 2. CRÉATION DU CLIENT SUPABASE "ADMIN" EN DIRECT
    // On le crée ici pour garantir qu'il utilise bien la clé SERVICE_ROLE
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("CRITIQUE: Variables Supabase manquantes sur Vercel !");
      return NextResponse.json({ error: "Configuration serveur incomplète" }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 3. LECTURE DU PAYLOAD N8N
    const body = await request.json();
    const { event_type, data } = body;

    if (!event_type || !data) {
      return NextResponse.json({ error: 'Payload invalide.' }, { status: 400 });
    }

    // 4. ROUTAGE ET INSERTION EN BASE DE DONNÉES
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

        if (sessionError) {
          console.error("Erreur d'insertion Supabase:", sessionError);
          throw sessionError;
        }
        break;

      // Garde tes autres cases (sync_student, sync_invoice, etc.) ici si tu les avais mis
      
      default:
        return NextResponse.json({ error: `Type inconnu : ${event_type}` }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Synchronisation réussie !" }, { status: 200 });

  } catch (error: any) {
    console.error(`Erreur Catch :`, error.message || error);
    return NextResponse.json({ error: error.message || 'Erreur interne' }, { status: 500 });
  }
}