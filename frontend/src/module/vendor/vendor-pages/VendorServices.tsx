import { useState, useMemo, memo, useCallback } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  IndianRupee,
  Grid3x3,
  List,
  Star,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, staggerItem, transitions } from "@/lib/animations";
import { useTouchFeedback } from "@/lib/touch";
import { CardSkeleton } from "@/components/ui/skeleton";
import { useServiceStore, type Service } from "../store/useServiceStore";
import { ServiceFormModal } from "../vendor-components/ServiceFormModal";
import { DeleteConfirmDialog } from "../vendor-components/DeleteConfirmDialog";

const categories = ["All", "Hair", "Skin", "Nails", "Grooming"];

// Service Card Component
const ServiceCard = memo(
  ({
    service,
    viewMode,
    onEdit,
    onToggleActive,
    onDelete,
  }: {
    service: Service;
    viewMode: "grid" | "list";
    onEdit: (service: Service) => void;
    onToggleActive: (id: string) => void;
    onDelete: (id: string) => void;
  }) => {
    const { isActive: isTouchActive, ...touchHandlers } = useTouchFeedback();
    const hasPricingTiers = service.pricingTiers && service.pricingTiers.length > 0;
    const minPrice = hasPricingTiers
      ? Math.min(...service.pricingTiers.map((t) => t.price))
      : service.price;
    const maxPrice = hasPricingTiers
      ? Math.max(...service.pricingTiers.map((t) => t.price))
      : service.price;

    if (viewMode === "list") {
      return (
        <motion.div
          variants={staggerItem}
          initial="hidden"
          animate="visible"
          className={cn(
            "bg-card border rounded-xl p-4 transition-all touch-manipulation active:scale-[0.98] shadow-sm hover:shadow-md",
            service.isActive
              ? "border-border hover:border-primary/50"
              : "border-border/50 opacity-60"
          )}
          {...touchHandlers}>
          <div className="flex items-start gap-4">
            {/* Service Image */}
            {service.image && (
              <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {/* Service Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground text-sm truncate">
                      {service.name}
                    </h3>
                    {service.rating && (
                      <div className="flex items-center gap-1 shrink-0">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium text-foreground">
                          {service.rating}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {service.category}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onToggleActive(service.id)}
                  className={cn(
                    "p-2 min-w-[40px] min-h-[40px] rounded-lg transition-colors touch-manipulation flex items-center justify-center shrink-0",
                    service.isActive
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                  aria-label={service.isActive ? "Deactivate" : "Activate"}>
                  {service.isActive ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </motion.button>
              </div>

              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {service.description}
              </p>

              <div className="flex items-center gap-4 mb-3 text-xs flex-wrap">
                <span className="flex items-center gap-1 text-primary font-semibold">
                  <IndianRupee className="w-3 h-3" />
                  {hasPricingTiers ? (
                    <span>
                      {minPrice === maxPrice ? (
                        minPrice
                      ) : (
                        `${minPrice} - ${maxPrice}`
                      )}
                    </span>
                  ) : (
                    service.price
                  )}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {service.duration} min
                </span>
                {service.bookings !== undefined && (
                  <span className="text-muted-foreground">
                    {service.bookings} bookings
                  </span>
                )}
              </div>
              {hasPricingTiers && (
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    {service.pricingTiers!.length} pricing options
                  </p>
                </div>
              )}
              {service.tags && service.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {service.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[10px]">
                      {tag}
                    </span>
                  ))}
                  {service.tags.length > 3 && (
                    <span className="px-2 py-0.5 text-muted-foreground text-[10px]">
                      +{service.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onEdit(service)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-primary/10 text-primary border border-primary/30 rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors min-h-[40px] touch-manipulation">
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDelete(service.id)}
                  className="px-3 py-2 bg-red-400/10 text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/20 transition-colors min-h-[40px] min-w-[40px] touch-manipulation flex items-center justify-center"
                  aria-label="Delete">
                  <Trash2 className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    // Grid view
    return (
      <motion.div
        variants={staggerItem}
        initial="hidden"
        animate="visible"
        className={cn(
          "bg-card border rounded-xl p-4 transition-all touch-manipulation active:scale-[0.98] shadow-sm hover:shadow-md flex flex-col h-full",
          service.isActive
            ? "border-border hover:border-primary/50"
            : "border-border/50 opacity-60"
        )}
        {...touchHandlers}>
        {service.image && (
          <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <h3 className="font-semibold text-foreground text-sm truncate flex-1">
                {service.name}
              </h3>
              {service.rating && (
                <div className="flex items-center gap-0.5 shrink-0">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{service.rating}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{service.category}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggleActive(service.id)}
            className={cn(
              "p-1.5 min-w-[36px] min-h-[36px] rounded-lg transition-colors touch-manipulation flex items-center justify-center shrink-0",
              service.isActive
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            )}
            aria-label={service.isActive ? "Deactivate" : "Activate"}>
            {service.isActive ? (
              <Eye className="w-3.5 h-3.5" />
            ) : (
              <EyeOff className="w-3.5 h-3.5" />
            )}
          </motion.button>
        </div>

        <p className="text-xs text-muted-foreground mb-3 line-clamp-2 flex-1">
          {service.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-3 text-xs flex-wrap">
            <span className="flex items-center gap-1 text-primary font-semibold">
              <IndianRupee className="w-3 h-3" />
              {hasPricingTiers ? (
                <span>
                  {minPrice === maxPrice ? (
                    minPrice
                  ) : (
                    `${minPrice} - ${maxPrice}`
                  )}
                </span>
              ) : (
                service.price
              )}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              {service.duration} min
            </span>
          </div>
          {hasPricingTiers && (
            <p className="text-xs text-muted-foreground">
              {service.pricingTiers!.length} pricing options
            </p>
          )}
          {service.bookings !== undefined && (
            <p className="text-xs text-muted-foreground">
              {service.bookings} bookings
            </p>
          )}
          {service.tags && service.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {service.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px]">
                  {tag}
                </span>
              ))}
              {service.tags.length > 2 && (
                <span className="px-1.5 py-0.5 text-muted-foreground text-[10px]">
                  +{service.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3 pt-3 border-t border-border">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(service)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 bg-primary/10 text-primary border border-primary/30 rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors min-h-[36px] touch-manipulation">
            <Edit3 className="w-3 h-3" />
            Edit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(service.id)}
            className="px-2 py-2 bg-red-400/10 text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/20 transition-colors min-h-[36px] min-w-[36px] touch-manipulation flex items-center justify-center"
            aria-label="Delete">
            <Trash2 className="w-3 h-3" />
          </motion.button>
        </div>
      </motion.div>
    );
  }
);

ServiceCard.displayName = "ServiceCard";

export function VendorServices() {
  const {
    services,
    addService,
    updateService,
    deleteService,
    toggleActive,
  } = useServiceStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch =
        searchQuery === "" ||
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.tags && service.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ));
      const matchesCategory =
        selectedCategory === "All" || service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [services, searchQuery, selectedCategory]);

  const handleToggleActive = useCallback(
    (id: string) => {
      toggleActive(id);
    },
    [toggleActive]
  );

  const handleEdit = useCallback(
    (service: Service) => {
      setSelectedService(service);
      setIsFormModalOpen(true);
    },
    []
  );

  const handleDelete = useCallback((id: string) => {
    const service = services.find((s) => s.id === id);
    if (service) {
      setServiceToDelete(service);
      setIsDeleteDialogOpen(true);
    }
  }, [services]);

  const handleConfirmDelete = useCallback(() => {
    if (serviceToDelete) {
      deleteService(serviceToDelete.id);
      setServiceToDelete(null);
    }
  }, [serviceToDelete, deleteService]);

  const handleAddService = () => {
    setSelectedService(null);
    setIsFormModalOpen(true);
  };

  const handleSaveService = useCallback(
    (serviceData: Omit<Service, "id">) => {
      if (selectedService) {
        updateService(selectedService.id, serviceData);
      } else {
        addService(serviceData);
      }
      setSelectedService(null);
    },
    [selectedService, addService, updateService]
  );

  const stats = useMemo(
    () => ({
      total: services.length,
      active: services.filter((s) => s.isActive).length,
      inactive: services.filter((s) => !s.isActive).length,
    }),
    [services]
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-3 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-base"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode("grid")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-all min-h-[44px] touch-manipulation",
                viewMode === "grid"
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "bg-card text-muted-foreground border border-border hover:border-primary/50"
              )}>
              <Grid3x3 className="w-4 h-4" />
              <span className="text-sm font-medium">Grid</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode("list")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-all min-h-[44px] touch-manipulation",
                viewMode === "list"
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "bg-card text-muted-foreground border border-border hover:border-primary/50"
              )}>
              <List className="w-4 h-4" />
              <span className="text-sm font-medium">List</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Total</p>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Active</p>
            <p className="text-2xl font-bold text-green-400">{stats.active}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Inactive</p>
            <p className="text-2xl font-bold text-muted-foreground">
              {stats.inactive}
            </p>
          </motion.div>
        </div>

        {/* Category Filter */}
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all min-h-[40px] touch-manipulation snap-center",
                  selectedCategory === category
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "bg-card text-muted-foreground border border-border hover:border-primary/50"
                )}>
                {category}
              </motion.button>
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none" />
        </div>

        {/* Services Grid/List */}
        {isLoading ? (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
                : "space-y-3"
            )}>
            {[1, 2, 3, 4].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filteredServices.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
                : "space-y-3"
            )}>
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                viewMode={viewMode}
                onEdit={handleEdit}
                onToggleActive={handleToggleActive}
                onDelete={handleDelete}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={transitions.smooth}
            className="text-center py-12 bg-card border border-border rounded-xl">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground text-sm">No services found</p>
          </motion.div>
        )}
      </div>

      {/* Floating Add Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleAddService}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-black rounded-full shadow-lg flex items-center justify-center z-40 touch-manipulation"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        aria-label="Add service">
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Service Form Modal */}
      <ServiceFormModal
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        onSave={handleSaveService}
        service={selectedService}
        categories={categories}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone."
        itemName={serviceToDelete?.name}
      />
    </div>
  );
}
