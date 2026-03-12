import type { Vertical } from '../../types/asset';
import { useAssetStore } from '../../store/assetStore';
import aceableLogo          from '../../assets/logos/aceable.svg?url';
import aceableAgentLogo     from '../../assets/logos/aceable-agent.svg?url';
import aceableInsuranceLogo from '../../assets/logos/aceable-insurance.svg?url';
import aceableMortgageLogo  from '../../assets/logos/aceable-mortgage.svg?url';

const VERTICALS: { id: Vertical; logo: string }[] = [
  { id: 'aceable',           logo: aceableLogo },
  { id: 'aceable-agent',     logo: aceableAgentLogo },
  { id: 'aceable-insurance', logo: aceableInsuranceLogo },
  { id: 'aceable-mortgage',  logo: aceableMortgageLogo },
];

interface Props {
  value?: Vertical;
  onChange?: (v: Vertical) => void;
}

export function VerticalSelector({ value, onChange }: Props) {
  const storeVertical = useAssetStore((s) => s.config.vertical);
  const setStoreVertical = useAssetStore((s) => s.setVertical);

  const vertical = value ?? storeVertical;
  const setVertical = onChange ?? setStoreVertical;

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
        Brand / Vertical
      </label>
      <div className="grid grid-cols-2 gap-2">
        {VERTICALS.map((v) => (
          <button
            key={v.id}
            onClick={() => setVertical(v.id)}
            className={`
              flex items-center justify-center rounded-lg border-2 px-3 py-2.5 transition-all
              ${vertical === v.id
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}
            `}
          >
            <img src={v.logo} alt={v.id} className="h-6 w-auto" />
          </button>
        ))}
      </div>
    </div>
  );
}
