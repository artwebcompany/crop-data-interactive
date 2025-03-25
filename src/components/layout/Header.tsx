
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface HeaderProps {
  country: string;
  dataType: string;
  className?: string;
}

export function Header({ country, dataType, className }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "w-full py-8 mb-6 text-center glass-panel rounded-xl",
        className
      )}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="container px-4 max-w-6xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          {dataType} of Food in {country}
        </h1>
        <p className="mt-3 text-muted-foreground text-lg max-w-3xl mx-auto">
          Visualize and analyze agricultural data trends over time
        </p>
      </motion.div>
    </motion.header>
  );
}
