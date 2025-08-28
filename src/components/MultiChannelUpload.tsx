import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useChannels } from '@/hooks/useChannels';
import { apiClient } from '@/lib/api';
import { Upload, CheckCircle, XCircle, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function MultiChannelUpload() {
  const { channels, loading: channelsLoading } = useChannels();
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState<{
    success: boolean;
    message: string;
    processed?: number;
    errors?: string[];
  } | null>(null);
  const { toast } = useToast();

  const onDrop = async (acceptedFiles: File[]) => {
    if (!selectedChannel) {
      toast({
        title: "Error",
        description: "Por favor selecciona un canal antes de subir el archivo",
        variant: "destructive"
      });
      return;
    }

    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: "Error",
        description: "Solo se permiten archivos CSV",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadResults(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await apiClient.uploadCSV(file, selectedChannel);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setUploadResults({
        success: true,
        message: result.message,
        processed: result.processed,
        errors: result.errors
      });

      toast({
        title: "Éxito",
        description: `Archivo procesado correctamente. ${result.processed} registros procesados.`,
      });

    } catch (error) {
      setUploadResults({
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido'
      });

      toast({
        title: "Error",
        description: "Error al subir el archivo",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  const selectedChannelName = channels.find(c => c.id === selectedChannel)?.name;

  return (
    <div className="space-y-6">
      {/* Channel Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Subir CSV Multi-Channel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Seleccionar Canal
            </label>
            <Select value={selectedChannel} onValueChange={setSelectedChannel} disabled={channelsLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un canal..." />
              </SelectTrigger>
              <SelectContent>
                {channels.map((channel) => (
                  <SelectItem key={channel.id} value={channel.id}>
                    <div className="flex items-center gap-2">
                      <span>{channel.name}</span>
                      {channel.realtime && (
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Drop Zone */}
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
              ${isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
              }
              ${!selectedChannel ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} disabled={!selectedChannel || uploading} />
            
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            
            {isDragActive ? (
              <p className="text-primary font-medium">Suelta el archivo aquí...</p>
            ) : (
              <div>
                <p className="font-medium mb-2">
                  Arrastra un archivo CSV aquí, o haz clic para seleccionar
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedChannelName 
                    ? `Canal seleccionado: ${selectedChannelName}` 
                    : 'Primero selecciona un canal'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subiendo archivo...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {/* Upload Results */}
          {uploadResults && (
            <Alert className={uploadResults.success ? 'border-green-200' : 'border-destructive'}>
              <div className="flex items-center gap-2">
                {uploadResults.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
                <AlertDescription>
                  <div>
                    <p>{uploadResults.message}</p>
                    {uploadResults.processed && (
                      <p className="text-sm mt-1">
                        Registros procesados: {uploadResults.processed}
                      </p>
                    )}
                    {uploadResults.errors && uploadResults.errors.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Errores encontrados:</p>
                        <ul className="text-sm mt-1 list-disc list-inside">
                          {uploadResults.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </div>
            </Alert>
          )}

          {/* Reset Button */}
          {uploadResults && (
            <Button 
              variant="outline" 
              onClick={() => {
                setUploadResults(null);
                setUploadProgress(0);
              }}
              className="w-full"
            >
              Subir Otro Archivo
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}