import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function ClubSelection() {
  const [, navigate] = useLocation();
  const [selectedClub, setSelectedClub] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data: clubs, isLoading } = trpc.champman.getClubs.useQuery();
  const createSeasonMutation = trpc.champman.createSeason.useMutation();

  const handleSelectClub = async (clubId: number) => {
    setSelectedClub(clubId);
    setIsCreating(true);

    try {
      await createSeasonMutation.mutateAsync({
        clubId,
        year: 2026,
      });

      // Navigate to dashboard
      navigate(`/dashboard/${clubId}`);
    } catch (error) {
      console.error("Error creating season:", error);
      setIsCreating(false);
      setSelectedClub(null);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="border-b-4 border-black p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-7xl font-black tracking-tighter mb-2">CHAMP MAN</h1>
          <p className="text-2xl font-bold tracking-wide">2026</p>
          <p className="text-lg mt-4 font-medium">Selecione seu clube para começar</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin w-12 h-12" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {clubs?.map((club) => (
                <button
                  key={club.id}
                  onClick={() => handleSelectClub(club.id)}
                  disabled={isCreating && selectedClub !== club.id}
                  className={`
                    border-4 border-black p-6 text-left transition-all
                    ${
                      selectedClub === club.id
                        ? "bg-black text-white scale-105"
                        : "bg-white hover:bg-black hover:text-white"
                    }
                    ${isCreating && selectedClub !== club.id ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  <div className="mb-4">
                    <h3 className="text-2xl font-black tracking-tight">{club.shortName}</h3>
                    <p className="text-sm font-bold mt-2 opacity-75">{club.state}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-bold">Valor:</span>
                      <span>€{parseFloat(club.marketValue || "0").toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Idade Média:</span>
                      <span>{parseFloat(club.avgAge || "0").toFixed(1)}</span>
                    </div>
                  </div>

                  {selectedClub === club.id && isCreating && (
                    <div className="mt-4 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm font-bold">Criando temporada...</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-4 border-black mt-12 p-8 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm font-bold">
            Gerencie seu clube através de uma temporada completa do Brasileirão 2026
          </p>
        </div>
      </div>
    </div>
  );
}
