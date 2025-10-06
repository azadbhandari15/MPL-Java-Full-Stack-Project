package com.mpl.auctionbackend.auctionbackend.service.impl;

import com.mpl.auctionbackend.auctionbackend.entity.PlayerEntity;
import com.mpl.auctionbackend.auctionbackend.model.PlayerPurseDto;
import com.mpl.auctionbackend.auctionbackend.entity.PlayerTeamEntity;
import com.mpl.auctionbackend.auctionbackend.entity.model.PlayerAuctionStatus;
import com.mpl.auctionbackend.auctionbackend.model.PlayerDetails;
import com.mpl.auctionbackend.auctionbackend.model.PlayerSoldRequestDto;
import com.mpl.auctionbackend.auctionbackend.repository.PlayerRepository;
import com.mpl.auctionbackend.auctionbackend.repository.PlayerTeamRepository;
import com.mpl.auctionbackend.auctionbackend.service.PlayerService;
import jakarta.transaction.Transactional;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PlayerServiceImpl implements PlayerService {

    private final PlayerRepository playerRepository;
    private final PlayerTeamRepository playerTeamRepository;

    public PlayerServiceImpl(PlayerRepository playerRepository,
                             PlayerTeamRepository playerTeamRepository) {
        this.playerRepository = playerRepository;
        this.playerTeamRepository = playerTeamRepository;
    }

    @Override
    public PlayerDetails findRandomPlayer() {
        System.out.println("Method called");
        List<PlayerEntity> allPlayers = playerRepository.findAll();
        PlayerEntity playerEntity;

            playerEntity = allPlayers.parallelStream()
                    .filter(player -> PlayerAuctionStatus.PENDING.equals(player.getPlayerAuctionStatus()))
                    .findAny()
                    .orElse(null);
            if(Objects.isNull(playerEntity)){
                playerEntity = allPlayers.parallelStream()
                        .filter(player -> PlayerAuctionStatus.UNSOLD.equals(player.getPlayerAuctionStatus()))
                        .findAny()
                        .orElseThrow(()->new RuntimeException("Player Details are not present"));
            }

        return PlayerDetails.builder()
                .id(playerEntity.getId())
                .name(playerEntity.getPlayerName())
                .role(playerEntity.getRole())
                .basePoint(playerEntity.getBasePoint())
                .image(playerEntity.getUrl())
                .playerId(playerEntity.getPlayerId())
                .build();
    }

    @Override
    @Transactional
    public void persistPlayers(InputStream inputStream) {
        List<PlayerEntity> playerEntities=new LinkedList<>();
        try {
            Sheet sheet;
            try (Workbook workbook = WorkbookFactory.create(inputStream)) {
                sheet = workbook.getSheetAt(0);
            }
            sheet.forEach(row->{
                if(row.getRowNum()!=0){
                    System.out.println(row.getCell(2).getStringCellValue()+" "+row.getCell(8));
                    PlayerEntity playerEntity=PlayerEntity.builder()
                            .playerName(row.getCell(2).getStringCellValue())
                            .mobileNumber(row.getCell(3).getStringCellValue())
                            .role(row.getCell(4).getStringCellValue())
                            .url(row.getCell(6).getStringCellValue())
                            .basePoint((int)row.getCell(8).getNumericCellValue())
                            .playerAuctionStatus("Captain".equalsIgnoreCase(row.getCell(9).getStringCellValue())
                                    ? PlayerAuctionStatus.CAPTAIN:PlayerAuctionStatus.PENDING)
                            .playerId(String.valueOf(UUID.randomUUID().toString()))
                            .build();
                    playerEntities.add(playerEntity);
                }
            });

            playerRepository.saveAll(playerEntities);
        }catch (Exception e){
            e.printStackTrace();
        }

    }

    @Override
    public void updatePlayerStatus(PlayerSoldRequestDto playerSoldRequestDto) {
        PlayerEntity byPlayerId = playerRepository.findByPlayerId(playerSoldRequestDto.getPlayerId()).orElse(null);
        if(Objects.nonNull(byPlayerId) && PlayerAuctionStatus.SOLD.equals(playerSoldRequestDto.getAuctionStatus())){
            PlayerTeamEntity playerTeamEntity= playerTeamRepository.findByTeamName(playerSoldRequestDto.getSelectedTeam());
            if(playerSoldRequestDto.getSoldAmount()>playerTeamEntity.getPurseAmount()){
                throw new RuntimeException("Auction Amount exceeds the purse prize therefore player cannot be sold to your team");
            }
            playerTeamEntity.getPlayer().add(byPlayerId);
            playerTeamEntity.setPurseAmount(playerTeamEntity.getPurseAmount()- playerSoldRequestDto.getSoldAmount());
            byPlayerId.setPlayerAuctionStatus(PlayerAuctionStatus.SOLD);
            byPlayerId.setPlayerTeamEntity(playerTeamEntity);
            byPlayerId.setSoldAmount(playerSoldRequestDto.getSoldAmount());
            playerTeamRepository.save(playerTeamEntity);
            playerRepository.save(byPlayerId);
        }
        else if(Objects.nonNull(byPlayerId) && PlayerAuctionStatus.UNSOLD.equals(playerSoldRequestDto.getAuctionStatus())){
            byPlayerId.setPlayerAuctionStatus(PlayerAuctionStatus.UNSOLD);
            playerRepository.save(byPlayerId);
        }
    }

    @Override
    public List<PlayerPurseDto> retrievePlayerPurse() {

        return null;
    }
}
