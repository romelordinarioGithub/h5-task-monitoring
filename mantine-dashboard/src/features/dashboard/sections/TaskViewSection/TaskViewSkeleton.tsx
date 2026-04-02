import { Box, Paper, ScrollArea, SimpleGrid, Skeleton, Table } from '@mantine/core';

export function TaskViewSectionSkeleton() {
  return (
    <>
      <Box>
        <Skeleton height={14} width={110} />
        <Skeleton height={22} width={140} mt={4} />
        <Skeleton height={24} width={140} radius="xl" mt="sm" />
      </Box>

      <SimpleGrid cols={{ base: 1, md: 2, xl: 6 }} mt="lg" className="task-filters">
        {Array.from({ length: 6 }, (_, idx) => (
          <Box key={`task-filter-skeleton-${idx}`}>
            <Skeleton height={12} width={84} mb="xs" />
            <Skeleton height={36} radius="md" />
          </Box>
        ))}
      </SimpleGrid>

      <Box mt="lg" className="task-table-scroll">
        <ScrollArea h={420} offsetScrollbars>
          <Table.ScrollContainer minWidth={920}>
            <Table verticalSpacing="md" className="task-table">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Task Name</Table.Th>
                  <Table.Th>Task Type</Table.Th>
                  <Table.Th>Channel</Table.Th>
                  <Table.Th>Health</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Priority</Table.Th>
                  <Table.Th>Assigned Dev</Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {Array.from({ length: 7 }, (_, idx) => (
                  <Table.Tr key={`task-row-skeleton-${idx}`}>
                    <Table.Td>
                      <Skeleton height={16} width="92%" />
                    </Table.Td>
                    <Table.Td>
                      <Skeleton height={16} width="80%" />
                    </Table.Td>
                    <Table.Td>
                      <Skeleton height={28} width={28} radius="xl" />
                    </Table.Td>
                    <Table.Td>
                      <Skeleton height={10} width="100%" radius="xl" />
                      <Skeleton height={12} width={52} mt={8} />
                    </Table.Td>
                    <Table.Td>
                      <Skeleton height={24} width={104} radius="xl" />
                    </Table.Td>
                    <Table.Td>
                      <Skeleton height={24} width={84} radius="xl" />
                    </Table.Td>
                    <Table.Td>
                      <Skeleton height={14} width={70} />
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </ScrollArea>
      </Box>
    </>
  );
}

export function TaskViewLazySkeleton() {
  return (
    <>
      {Array.from({ length: 3 }, (_, idx) => (
        <Table.Tr key={`task-lazy-skeleton-${idx}`}>
          <Table.Td>
            <Skeleton height={16} width="92%" />
          </Table.Td>
          <Table.Td>
            <Skeleton height={16} width="80%" />
          </Table.Td>
          <Table.Td>
            <Skeleton height={28} width={28} radius="xl" />
          </Table.Td>
          <Table.Td>
            <Skeleton height={10} width="100%" radius="xl" />
            <Skeleton height={12} width={52} mt={8} />
          </Table.Td>
          <Table.Td>
            <Skeleton height={24} width={104} radius="xl" />
          </Table.Td>
          <Table.Td>
            <Skeleton height={24} width={84} radius="xl" />
          </Table.Td>
          <Table.Td>
            <Skeleton height={14} width={70} />
          </Table.Td>
        </Table.Tr>
      ))}
    </>
  );
}
