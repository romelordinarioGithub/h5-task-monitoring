import { useEffect, useMemo, useState } from 'react';
import {
  ActionIcon,
  Badge,
  Card,
  Grid,
  Group,
  Paper,
  Progress,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useDashboard } from '../../providers/DashboardProvider';
import { KPISnapshotSkeleton } from './KPISnapshotSkeleton';
import { useKPISnapshot } from './useKPISnapshot';

export function KPISnapshotSection() {
  const { filters, setFilters } = useDashboard();
  const { taskTypes, totalTaskCount, isLoading, error } = useKPISnapshot();
  const [activeSlide, setActiveSlide] = useState(0);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');

  const slides = useMemo(() => {
    const chunkSize = 6;
    const pages = [];

    for (let index = 0; index < taskTypes.length; index += chunkSize) {
      pages.push(taskTypes.slice(index, index + chunkSize));
    }

    return pages;
  }, [taskTypes]);

  useEffect(() => {
    setActiveSlide(0);
    setAutoPlayEnabled(true);
  }, [taskTypes]);

  useEffect(() => {
    if (!autoPlayEnabled) return;
    if (slides.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setSlideDirection('next');
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 20_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [autoPlayEnabled, slides.length]);

  const currentSlide = slides[activeSlide] ?? [];
  const displaySlide =
    currentSlide.length >= 6
      ? currentSlide
      : [...currentSlide, ...Array.from({ length: 6 - currentSlide.length }, () => null)];

  const goToSlide = (index: number) => {
    setAutoPlayEnabled(false);
    setSlideDirection(index >= activeSlide ? 'next' : 'prev');
    setActiveSlide(index);
  };

  const goToPreviousSlide = () => {
    setAutoPlayEnabled(false);
    setSlideDirection('prev');
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setAutoPlayEnabled(false);
    setSlideDirection('next');
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  return (
    <Grid.Col span={{ base: 12, xl: 6 }}>
      <Card withBorder radius="md" padding="lg" h="100%">
        {isLoading ? (
          <KPISnapshotSkeleton />
        ) : error ? (
          <>
            <Text className="section-kicker">KPI Snapshot</Text>
            <Title order={3} mt={4}>
              Task Type Summary
            </Title>
            <Text c="red" mt="lg">
              {error}
            </Text>
          </>
        ) : (
          <>
            <Text className="section-kicker">KPI Snapshot</Text>
            <Group justify="space-between" align="center" mt={4} className="kpi-carousel-header">
              <Title order={3}>Task Type Summary</Title>
              <Group gap="xs" wrap="nowrap" className="kpi-carousel-controls">
                <Badge color="gray" variant="light" radius="xl" className="kpi-carousel-count">
                {taskTypes.length} task types
              </Badge>

                {slides.length > 1 ? (
                  <Group gap={8} wrap="nowrap">
                    <ActionIcon
                      variant="light"
                      color="gray"
                      radius="xl"
                      className="kpi-carousel-arrow"
                      onClick={goToPreviousSlide}
                      aria-label="Previous task type page"
                    >
                      <IconChevronLeft size={18} />
                    </ActionIcon>

                    <ActionIcon
                      variant="light"
                      color="gray"
                      radius="xl"
                      className="kpi-carousel-arrow"
                      onClick={goToNextSlide}
                      aria-label="Next task type page"
                    >
                      <IconChevronRight size={18} />
                    </ActionIcon>
                  </Group>
                ) : null}
              </Group>
            </Group>

            <div className="kpi-carousel-stage">
              <div
                key={`kpi-slide-${activeSlide}`}
                className={`kpi-carousel-grid kpi-carousel-grid--${slideDirection}`}
              >
                {displaySlide.map((type, index) => {
                  if (!type) {
                    return <div key={`kpi-placeholder-${activeSlide}-${index}`} className="kpi-carousel-placeholder" />;
                  }

                  const share =
                    totalTaskCount > 0
                      ? Math.round((type.count / totalTaskCount) * 100)
                      : 0;
                  const Icon = type.icon;
                  const isActive = filters.taskType === type.name;

                  return (
                    <Paper
                      key={type.name}
                      className={`stat-card kpi-carousel-card ${isActive ? 'is-active' : ''}`}
                      p="lg"
                      radius="md"
                      onClick={() =>
                        setFilters((current) => ({
                          ...current,
                          taskType: current.taskType === type.name ? 'All' : type.name,
                        }))
                      }
                    >
                      <Group justify="space-between" align="flex-start" gap="xs">
                        <ThemeIcon
                          size={42}
                          radius="md"
                          variant="light"
                          color="grape"
                          className="kpi-carousel-icon"
                        >
                          <Icon size={20} />
                        </ThemeIcon>

                        <Badge
                          color="gray"
                          variant="light"
                          radius="xl"
                          className="kpi-carousel-load"
                        >
                          {share}% load
                        </Badge>
                      </Group>

                      <Text fw={600} mt="md" className="kpi-carousel-title" lineClamp={2}>
                        {type.name}
                      </Text>

                      <Group align="end" gap={8} mt="sm">
                        <Title order={1} className="stat-card-value kpi-carousel-value">
                          {type.count}
                        </Title>
                        <Text mb={6} c="dimmed" className="kpi-carousel-unit">
                          tasks
                        </Text>
                      </Group>

                      <Progress value={share} color="grape" radius="xl" mt="md" />
                    </Paper>
                  );
                })}
              </div>
            </div>

            {slides.length > 1 ? (
              <Group justify="center" gap={8} mt="md" className="kpi-carousel-dots">
                {slides.map((_, index) => (
                  <button
                    key={`kpi-slide-dot-${index}`}
                    type="button"
                    className={`kpi-carousel-dot ${index === activeSlide ? 'is-active' : ''}`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to task type page ${index + 1}`}
                  />
                ))}
              </Group>
            ) : null}
          </>
        )}
      </Card>
    </Grid.Col>
  );
}
