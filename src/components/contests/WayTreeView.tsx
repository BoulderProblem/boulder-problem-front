import React, { useEffect, useMemo, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { ZONE } from '@/types/zone';
import { Box, Checkbox } from '@mui/material';
import { WAY } from '@/types/way';
import { WALL } from '@/types/wall';
import { useContests } from '@/services/useContests';

interface WayTreeViewProps {
  data: ZONE[];
  selectedId: number[];
  id: string;
}

const WayTreeView: React.FC<WayTreeViewProps> = ({ data, selectedId, id }) => {
  const { addWayContest, deleteWayContest } = useContests();
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  useEffect(() => {
    setExpandedIds(getDefaultExpandedItems(data));
  }, [data]);

  const getDefaultExpandedItems = (data: ZONE[]): string[] => {
    const expanded: string[] = [];

    data.forEach((zone) => {
      expanded.push(`zone${zone.id}`);
    });

    return expanded;
  };

  const toggleCheck = (wayId: number, checked: boolean) => {
    if (checked) {
      addWayContest(id, wayId);
    } else {
      deleteWayContest(id, wayId);
    }
  };

  const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
    color: theme.palette.grey[200],
    [`& .${treeItemClasses.content}`]: {
      borderRadius: theme.spacing(0.5),
      padding: theme.spacing(0.5, 1),
      margin: theme.spacing(0.2, 0),
      [`& .${treeItemClasses.label}`]: {
        fontSize: '0.8rem',
        fontWeight: 500,
      },
    },
    [`& .${treeItemClasses.iconContainer}`]: {
      borderRadius: '50%',
      backgroundColor: theme.palette.primary.dark,
      padding: theme.spacing(0, 1.2),
      ...theme.applyStyles('light', {
        backgroundColor: alpha(theme.palette.primary.main, 0.25),
      }),
      ...theme.applyStyles('dark', {
        color: theme.palette.primary.contrastText,
      }),
    },
    [`& .${treeItemClasses.groupTransition}`]: {
      marginLeft: 15,
      paddingLeft: 18,
      borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    },
    ...theme.applyStyles('light', {
      color: theme.palette.grey[800],
    }),
  }));

  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <SimpleTreeView
        expandedItems={expandedIds}
        onExpandedItemsChange={(e, itemIds) => setExpandedIds(itemIds ?? [])}
      >
        {data.map((zone: ZONE) => (
          <CustomTreeItem
            key={`zone${zone.id}`}
            itemId={`zone${zone.id}`}
            label={`zone : ${zone.name}`}
          >
            {zone.walls.map((wall: WALL) => (
              <CustomTreeItem
                key={'wall' + wall.id}
                itemId={'wall' + wall.id}
                label={`mur : ${wall.name}`}
              >
                {wall.ways.map((way: WAY) => (
                  <CustomTreeItem
                    key={'way' + way.id}
                    itemId={'way' + way.id}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Checkbox
                          size="small"
                          checked={selectedId.includes(way.id)}
                          onChange={(e) =>
                            toggleCheck(way.id, e.target.checked)
                          }
                          onClick={(e) => e.stopPropagation()} // empêche la sélection du TreeItem au clic
                        />
                        <Box
                          key={'box' + way.id}
                          sx={{
                            width: 15,
                            height: 15,
                            borderRadius: '50%',
                            backgroundColor: way.color.color,
                            marginRight: 1,
                          }}
                        />
                        {way.name}
                      </Box>
                    }
                  />
                ))}
              </CustomTreeItem>
            ))}
          </CustomTreeItem>
        ))}
      </SimpleTreeView>
    </Box>
  );
};

export default WayTreeView;
