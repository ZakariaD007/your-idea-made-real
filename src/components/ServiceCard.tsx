import { MapPin, Clock, Phone } from 'lucide-react';
import { Service, serviceTypeLabels } from '@/data/services';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  service: Service;
  isSelected?: boolean;
  onClick?: () => void;
}

const typeColors: Record<string, string> = {
  clinic: 'service-badge-clinic',
  library: 'service-badge-library',
  shelter: 'service-badge-shelter',
  food: 'service-badge-food',
};

export function ServiceCard({ service, isSelected, onClick }: ServiceCardProps) {
  return (
    <div
      className={cn(
        'service-card',
        isSelected && 'border-primary ring-2 ring-primary/20'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-foreground leading-tight">{service.name}</h3>
        <span className={cn('service-badge shrink-0', typeColors[service.type])}>
          {serviceTypeLabels[service.type]}
        </span>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{service.address}</span>
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4 shrink-0" />
          <span>{service.hours}</span>
        </div>
        
        {service.phone && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0" />
            <a 
              href={`tel:${service.phone}`} 
              className="hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {service.phone}
            </a>
          </div>
        )}
      </div>
      
      {service.description && (
        <p className="mt-3 text-sm text-muted-foreground/80 line-clamp-2">
          {service.description}
        </p>
      )}
    </div>
  );
}
