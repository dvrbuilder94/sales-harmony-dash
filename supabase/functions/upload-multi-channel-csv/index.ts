import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const { csvData, channelId, fileName } = await req.json();

    console.log(`Processing CSV file: ${fileName} for channel: ${channelId}`);
    console.log(`CSV data rows: ${csvData.length}`);

    if (!csvData || !Array.isArray(csvData) || csvData.length === 0) {
      throw new Error('No valid CSV data provided');
    }

    // Validate and transform CSV data
    const validRows = [];
    let processedCount = 0;
    let errorCount = 0;

    for (const row of csvData) {
      try {
        // Validate required fields
        if (!row.order_id || !row.fecha || !row.monto_bruto || !row.monto_neto) {
          console.log('Skipping row due to missing required fields:', row);
          errorCount++;
          continue;
        }

        const ventaData = {
          order_id: String(row.order_id).trim(),
          fecha: new Date(row.fecha).toISOString().split('T')[0],
          monto_bruto: parseFloat(row.monto_bruto) || 0,
          monto_neto: parseFloat(row.monto_neto) || 0,
          iva: parseFloat(row.iva) || 0,
          comisiones: parseFloat(row.comisiones) || 0,
          devoluciones: parseFloat(row.devoluciones) || 0,
          channel_id: channelId,
        };

        validRows.push(ventaData);
        processedCount++;
      } catch (error) {
        console.error('Error processing row:', error, row);
        errorCount++;
      }
    }

    console.log(`Processed: ${processedCount}, Errors: ${errorCount}`);

    if (validRows.length === 0) {
      throw new Error('No valid rows found in the CSV data');
    }

    // Insert data in batches to avoid timeouts
    const batchSize = 100;
    let insertedCount = 0;

    for (let i = 0; i < validRows.length; i += batchSize) {
      const batch = validRows.slice(i, i + batchSize);
      
      const { data, error } = await supabaseClient
        .from('ventas')
        .upsert(batch, { 
          onConflict: 'order_id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('Batch insert error:', error);
        throw error;
      }

      insertedCount += batch.length;
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}, total: ${insertedCount}`);
    }

    // Log the upload activity
    await supabaseClient
      .from('audit_logs')
      .insert({
        action: 'CSV_UPLOAD',
        details: `Uploaded ${fileName}: ${insertedCount} records processed, ${errorCount} errors`,
        channel_id: channelId,
      });

    console.log('CSV upload completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        processed: insertedCount,
        errors: errorCount,
        message: `Successfully processed ${insertedCount} records with ${errorCount} errors`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('CSV upload error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error occurred',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});