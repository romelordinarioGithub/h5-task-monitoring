import React, { useContext } from 'react';

import PropTypes from 'prop-types';

import { Box, Typography, Switch } from '@mui/material';

import { NestedMenuItem } from 'mui-nested-menu';
import { filterList } from 'pages/Dashboard/constant';
import DashboardContext from 'pages/Dashboard/context';
import _ from 'lodash';

import Users from 'pages/Dashboard/components/Filters/Users';
import Status from 'pages/Dashboard/components/Filters/Status';
import Priority from 'pages/Dashboard/components/Filters/Priority';

export default function Filters({ onFilterChange }) {
  const {
    state,
    members,
    priorities,
    statuses,
    fetchMembers,
    fetchStatuses,
    fetchPriorities,
    team_id,
    admin_role,
  } = useContext(DashboardContext);

  return (
    <Box
      sx={{
        width: '150px',
      }}
    >
      <Box px="12px">
        <Typography variant="button" fontWeight={800}>
          Filters
        </Typography>
      </Box>
      {team_id !== 11 && team_id !== 21 && (
        <>
          <Box
            py={0.8}
            pl="12px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography>Subtask</Typography>
            <Switch
              size="small"
              color="success"
              checked={state?.filter?.subtask}
              onChange={(e) => onFilterChange({ subtask: e.target.checked })}
            />
          </Box>
          <Box
            py={0.8}
            pl="12px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography>Threads</Typography>
            <Switch
              size="small"
              color="success"
              checked={state?.filter?.threads}
              onChange={(e) => onFilterChange({ threads: e.target.checked })}
            />
          </Box>
          {team_id === 5 && (
            <Box
              py={0.8}
              pl="12px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography>Smart Services</Typography>
              <Switch
                size="small"
                color="success"
                checked={state?.filter?.smart_services}
                onChange={(e) =>
                  onFilterChange({ smart_services: e.target.checked })
                }
              />
            </Box>
          )}
          {team_id === 2 && (
            <Box
              py={0.8}
              pl="12px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography>MSS</Typography>
              <Switch
                size="small"
                color="success"
                checked={state?.filter?.mss}
                onChange={(e) => onFilterChange({ mss: e.target.checked })}
              />
            </Box>
          )}
        </>
      )}
      {filterList?.map((data, index) => {
        switch (data.filter_key) {
          case 'assignee':
            return (
              <NestedMenuItem
                key={index}
                label={data?.label}
                parentMenuOpen={true}
              >
                <Users
                  data={members?.data}
                  fetch={fetchMembers}
                  value={_.map(state.filter.assignees, (id) => ({
                    user_id: Number(id),
                  }))}
                  team_id={team_id}
                  onSelect={(id, data) =>
                    onFilterChange({
                      assignees: _.map(data ?? [], (d) => Number(d.user_id)),
                    })
                  }
                />
              </NestedMenuItem>
            );

          case 'status':
            return (
              <NestedMenuItem
                key={index}
                label={data?.label}
                parentMenuOpen={true}
              >
                <Status
                  data={statuses}
                  fetch={fetchStatuses}
                  value={state.filter.status}
                  multiselect
                  onSelect={(data) =>
                    onFilterChange({
                      status: data,
                    })
                  }
                />
              </NestedMenuItem>
            );

          case 'priority':
            return (
              <NestedMenuItem
                key={index}
                label={data?.label}
                parentMenuOpen={true}
              >
                <Priority
                  data={priorities}
                  admin_role={admin_role}
                  fetch={fetchPriorities}
                  value={state.filter.priority}
                  multiselect
                  onSelect={(data) =>
                    onFilterChange({
                      priority: data,
                    })
                  }
                />
              </NestedMenuItem>
            );
        }
      })}
    </Box>
  );
}

Filters.propTypes = {
  anchorEl: PropTypes.any,
  open: PropTypes.any,
  onClose: PropTypes.func,
  onFilterChange: PropTypes.func,
};
